package http

import (
	"crypto/hmac"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/hex"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"strings"
)

// HandleGitHubWebhook handles incoming GitHub webhook notifications with HMAC-SHA256 signature verification.
func (h *Handler) HandleGitHubWebhook(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Method not allowed")
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		slog.Error(fmt.Sprintf("[HTTP] [ERROR] Failed to read webhook body: %v", err))
		writeError(w, http.StatusBadRequest, "INVALID_REQUEST", "Failed to read request body")
		return
	}

	// Verify HMAC signature if webhook secret is configured
	if h.webhookSecret != "" {
		sigHeader := r.Header.Get("X-Hub-Signature-256")
		if sigHeader == "" {
			writeError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Missing X-Hub-Signature-256 header")
			return
		}

		sig, ok := strings.CutPrefix(sigHeader, "sha256=")
		if !ok {
			writeError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Invalid signature format; expected sha256=<hex>")
			return
		}

		mac := hmac.New(sha256.New, []byte(h.webhookSecret))
		mac.Write(body)
		expectedSig := hex.EncodeToString(mac.Sum(nil))

		if subtle.ConstantTimeCompare([]byte(sig), []byte(expectedSig)) != 1 {
			slog.Warn("[HTTP] [WARN] Webhook HMAC signature mismatch")
			writeError(w, http.StatusUnauthorized, "UNAUTHORIZED", "Webhook signature verification failed")
			return
		}
	}

	eventType := r.Header.Get("X-GitHub-Event")
	if eventType == "" {
		eventType = "issue_comment"
	}

	if err := h.svc.HandleGitHubWebhook(r.Context(), eventType, body); err != nil {
		slog.Error(fmt.Sprintf("[HTTP] [ERROR] Webhook processing failed: %v", err))
		writeError(w, http.StatusInternalServerError, "WEBHOOK_FAILED", fmt.Sprintf("Webhook processing error: %v", err))
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{
		"status":  "ok",
		"message": "Webhook processed successfully",
	})
}
