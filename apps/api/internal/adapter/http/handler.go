package http

import (
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
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
	svc in.Service
}

// NewHandler creates a new HTTP Handler instance.
func NewHandler(svc in.Service) *Handler {
	return &Handler{
		svc: svc,
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
		File  string `json:"file,omitempty"`
	}
	_ = json.NewDecoder(r.Body).Decode(&body)

	target := body.File
	if target == "" {
		target = body.JobID
	}

	jobID, err := h.svc.ReplayExtraction(r.Context(), target)
	if err != nil {
		slog.Error(fmt.Sprintf("[HTTP] [ERROR] Replay failed: %v", err))
		if errors.Is(err, os.ErrNotExist) || strings.Contains(err.Error(), "not found") {
			writeError(w, http.StatusNotFound, "NOT_FOUND", err.Error())
			return
		}
		writeError(w, http.StatusBadRequest, "INVALID_PAYLOAD", err.Error())
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

	resp := contracts.JobResponse{
		JobId:          job.ID,
		Status:         job.Status,
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
