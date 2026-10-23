package http

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/dwlhm/supernova/apps/api/internal/core/domain"
	"github.com/dwlhm/supernova/apps/api/internal/core/port/in"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
	"github.com/google/uuid"
)

// Handler handles incoming HTTP requests for extraction jobs.
type Handler struct {
	svc           in.Service
	webhookSecret string
}

// NewHandler creates a new HTTP Handler instance.
func NewHandler(svc in.Service, webhookSecret ...string) *Handler {
	var secret string
	if len(webhookSecret) > 0 {
		secret = webhookSecret[0]
	}
	return &Handler{
		svc:           svc,
		webhookSecret: secret,
	}
}

// HandleSubmitExtraction parses an extraction request and enqueues the job.
func (h *Handler) HandleSubmitExtraction(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		return
	}

	var req contracts.ExtractionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		slog.Error(fmt.Sprintf("[HTTP] [ERROR] Failed to parse request JSON: %v", err))
		writeError(w, http.StatusBadRequest, "INVALID_REQUEST", fmt.Sprintf("Failed to parse request JSON: %v", err))
		return
	}

	slog.Info(fmt.Sprintf("[HTTP] Extraction submitted: doc=%s components=%d", req.Document.Name, len(req.Document.Components)))

	jobID, err := h.svc.SubmitExtraction(r.Context(), req)
	if err != nil {
		if errors.Is(err, domain.ErrInvalidPayload) {
			writeError(w, http.StatusBadRequest, "INVALID_PAYLOAD", err.Error())
			return
		}
		writeError(w, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}

	jobUUID, err := uuid.Parse(jobID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Generated invalid job ID")
		return
	}

	resp := contracts.ExtractionResponse{
		JobId:     jobUUID,
		Status:    contracts.JobStatusQueued,
		CreatedAt: time.Now().UTC(),
	}
	writeJSON(w, http.StatusAccepted, resp)
}

// HandleReplayExtraction enqueues an extraction job by reading a persisted extraction payload.
func (h *Handler) HandleReplayExtraction(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		return
	}

	var body struct {
		JobID string `json:"jobId,omitempty"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil && !errors.Is(err, io.EOF) {
		writeError(w, http.StatusBadRequest, "INVALID_REQUEST", "Request body must be JSON: {\"jobId\": \"<uuid>|latest\"}")
		return
	}

	jobID, err := h.svc.ReplayExtraction(r.Context(), body.JobID)
	if err != nil {
		switch {
		case errors.Is(err, domain.ErrInvalidPayload):
			writeError(w, http.StatusBadRequest, "INVALID_PAYLOAD", err.Error())
		case errors.Is(err, domain.ErrExtractionNotFound):
			writeError(w, http.StatusNotFound, "NOT_FOUND", "No persisted extraction for the given job ID")
		default:
			slog.Error("[HTTP] [ERROR] Replay failed", "error", err)
			writeError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Replay failed")
		}
		return
	}

	jobUUID, err := uuid.Parse(jobID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Generated invalid job ID")
		return
	}

	resp := contracts.ExtractionResponse{
		JobId:     jobUUID,
		Status:    contracts.JobStatusQueued,
		CreatedAt: time.Now().UTC(),
	}
	writeJSON(w, http.StatusAccepted, resp)
}

// HandleGetJob returns the current status and details of an extraction job.
func (h *Handler) HandleGetJob(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		return
	}

	id := extractJobID(r)
	if id == "" {
		writeError(w, http.StatusBadRequest, "INVALID_JOB_ID", "Job ID is required")
		return
	}

	job, err := h.svc.GetJob(r.Context(), id)
	if err != nil {
		if errors.Is(err, domain.ErrJobNotFound) {
			writeError(w, http.StatusNotFound, "NOT_FOUND", "Job not found")
			return
		}
		writeError(w, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}

	var runIDPtr *string
	if job.RunID != "" {
		runIDPtr = &job.RunID
	}
	var tasksList *[]contracts.ComponentTask
	if len(job.Tasks) > 0 {
		tl := make([]contracts.ComponentTask, len(job.Tasks))
		for i, t := range job.Tasks {
			tl[i] = t.ToContract()
		}
		tasksList = &tl
	}

	resp := contracts.JobResponse{
		JobId:          job.ID,
		Status:         job.Status,
		RunId:          runIDPtr,
		Tasks:          tasksList,
		Targets:        job.Targets,
		Publishers:     job.Publishers,
		Components:     job.Components,
		PublishResults: job.PublishResults,
		CreatedAt:      job.CreatedAt,
		UpdatedAt:      job.UpdatedAt,
		Error:          job.Error,
	}
	writeJSON(w, http.StatusOK, resp)
}

// HandleJobEvents streams real-time status updates via SSE for an extraction job.
func (h *Handler) HandleJobEvents(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		return
	}

	id := strings.TrimSuffix(strings.TrimPrefix(r.URL.Path, "/v1/jobs/"), "/events")
	if id == "" {
		writeError(w, http.StatusBadRequest, "INVALID_JOB_ID", "Job ID is required")
		return
	}

	flusher, ok := w.(http.Flusher)
	if !ok {
		writeError(w, http.StatusInternalServerError, "STREAMING_UNSUPPORTED", "Streaming unsupported")
		return
	}

	eventsChan, unsub, err := h.svc.SubscribeJobEvents(r.Context(), id)
	if err != nil {
		if errors.Is(err, domain.ErrJobNotFound) {
			writeError(w, http.StatusNotFound, "NOT_FOUND", "Job not found")
			return
		}
		writeError(w, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}
	defer unsub()

	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("X-Accel-Buffering", "no")
	w.WriteHeader(http.StatusOK)
	flusher.Flush()

	fmt.Fprintf(w, ": connected\n\n")
	flusher.Flush()

	for {
		select {
		case <-r.Context().Done():
			return
		case ev, ok := <-eventsChan:
			if !ok {
				return
			}
			data, err := json.Marshal(ev)
			if err != nil {
				continue
			}
			fmt.Fprintf(w, "event: %s\ndata: %s\n\n", ev.EventType, string(data))
			flusher.Flush()

			if ev.EventType == "job_completed" || ev.EventType == "job_failed" {
				return
			}
		}
	}
}

// HandleDownloadZip streams the zipped artifacts for a completed job.
func (h *Handler) HandleDownloadZip(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		return
	}

	id := extractJobID(r)
	if id == "" {
		writeError(w, http.StatusBadRequest, "INVALID_JOB_ID", "Job ID is required")
		return
	}

	zipBytes, err := h.svc.GetDownloadZip(r.Context(), id)
	if err != nil {
		if errors.Is(err, domain.ErrJobNotFound) {
			writeError(w, http.StatusNotFound, "NOT_FOUND", "Job not found")
			return
		}
		if errors.Is(err, domain.ErrJobNotFinished) {
			writeError(w, http.StatusConflict, "JOB_NOT_READY", "Job is not finished or artifacts not ready")
			return
		}
		writeError(w, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/zip")
	w.Header().Set("Content-Disposition", `attachment; filename="components.zip"`)
	w.Header().Set("Content-Length", strconv.Itoa(len(zipBytes)))
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write(zipBytes)
}

// HandleSubmitSync handles POST /v1/syncs, calculating and returning a diff plan.
func (h *Handler) HandleSubmitSync(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		return
	}

	var req contracts.SyncRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		slog.Error(fmt.Sprintf("[HTTP] [ERROR] Failed to parse sync request JSON: %v", err))
		writeError(w, http.StatusBadRequest, "INVALID_REQUEST", fmt.Sprintf("Failed to parse request JSON: %v", err))
		return
	}

	plan, err := h.svc.SubmitSync(r.Context(), req)
	if err != nil {
		if errors.Is(err, domain.ErrInvalidPayload) {
			writeError(w, http.StatusBadRequest, "INVALID_PAYLOAD", err.Error())
			return
		}
		writeError(w, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}

	resp := contracts.SyncPlanResponse{
		SyncId:       plan.SyncID,
		DocumentName: plan.DocumentName,
		Summary:      plan.Summary,
		Components:   plan.Components,
		Tokens:       plan.Tokens,
		CreatedAt:    plan.CreatedAt,
	}
	writeJSON(w, http.StatusOK, resp)
}

// HandleReplaySync handles POST /v1/syncs/replay, reading a persisted extraction payload to compute a sync plan.
func (h *Handler) HandleReplaySync(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		return
	}

	var body struct {
		JobID   string                       `json:"jobId,omitempty"`
		Fixture string                       `json:"fixture,omitempty"`
		Options *contracts.ExtractionOptions `json:"options,omitempty"`
	}
	if r.Body != nil && r.ContentLength > 0 {
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil && !errors.Is(err, io.EOF) {
			writeError(w, http.StatusBadRequest, "INVALID_REQUEST", "Request body must be JSON: {\"jobId\": \"<uuid>|latest\"}")
			return
		}
	}

	target := body.JobID
	if target == "" {
		target = body.Fixture
	}

	plan, err := h.svc.ReplaySync(r.Context(), target, body.Options)
	if err != nil {
		switch {
		case errors.Is(err, domain.ErrInvalidPayload):
			writeError(w, http.StatusBadRequest, "INVALID_PAYLOAD", err.Error())
		case errors.Is(err, domain.ErrExtractionNotFound):
			writeError(w, http.StatusNotFound, "NOT_FOUND", "No persisted extraction for the given job ID or fixture")
		default:
			slog.Error("[HTTP] [ERROR] Replay sync failed", "error", err)
			writeError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Replay sync failed")
		}
		return
	}

	resp := contracts.SyncPlanResponse{
		SyncId:       plan.SyncID,
		DocumentName: plan.DocumentName,
		Summary:      plan.Summary,
		Components:   plan.Components,
		Tokens:       plan.Tokens,
		CreatedAt:    plan.CreatedAt,
	}
	writeJSON(w, http.StatusOK, resp)
}

// HandleApplySync handles POST /v1/syncs/{id}/apply, triggering job execution from a sync plan.
func (h *Handler) HandleApplySync(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		return
	}

	subpath := strings.TrimPrefix(r.URL.Path, "/v1/syncs/")
	syncID := strings.TrimSuffix(subpath, "/apply")
	syncID = strings.Trim(syncID, "/")

	if syncID == "" {
		writeError(w, http.StatusBadRequest, "INVALID_REQUEST", "Missing sync ID")
		return
	}

	var req contracts.ApplySyncRequest
	if r.Body != nil && r.ContentLength > 0 {
		_ = json.NewDecoder(r.Body).Decode(&req)
	}

	jobID, err := h.svc.ApplySync(r.Context(), syncID, &req)
	if err != nil {
		if errors.Is(err, domain.ErrJobNotFound) || errors.Is(err, domain.ErrSyncPlanNotFound) {
			writeError(w, http.StatusNotFound, "NOT_FOUND", "Sync plan not found")
			return
		}
		if errors.Is(err, domain.ErrInvalidPayload) {
			writeError(w, http.StatusBadRequest, "INVALID_PAYLOAD", err.Error())
			return
		}
		writeError(w, http.StatusInternalServerError, "INTERNAL_ERROR", err.Error())
		return
	}

	jobUUID, err := uuid.Parse(jobID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Generated invalid job ID")
		return
	}

	resp := contracts.ExtractionResponse{
		JobId:     jobUUID,
		Status:    contracts.JobStatusQueued,
		CreatedAt: time.Now().UTC(),
	}
	writeJSON(w, http.StatusAccepted, resp)
}

// HandleHealth provides a health check endpoint.
func (h *Handler) HandleHealth(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		return
	}

	resp := contracts.HealthResponse{
		Status:  "ok",
		Version: "1.0.0",
	}
	writeJSON(w, http.StatusOK, resp)
}

func extractJobID(r *http.Request) string {
	if id := r.PathValue("id"); id != "" {
		return id
	}
	path := strings.TrimPrefix(r.URL.Path, "/v1/jobs/")
	path = strings.TrimSuffix(path, "/download")
	return strings.Trim(path, "/")
}

func writeJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(data)
}

func writeError(w http.ResponseWriter, status int, code, message string) {
	if status >= 500 {
		slog.Error(fmt.Sprintf("[HTTP] [ERROR] Error response %s (%d): %s", code, status, message))
	} else {
		slog.Warn(fmt.Sprintf("[HTTP] [WARN] Error response %s (%d): %s", code, status, message))
	}
	writeJSON(w, status, contracts.ErrorResponse{
		Code:    code,
		Message: message,
	})
}
