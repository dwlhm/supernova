package http

import (
	"crypto/subtle"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"strings"
	"time"

	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
	"github.com/google/uuid"
)

type responseRecorder struct {
	http.ResponseWriter
	statusCode   int
	bytesWritten int64
	wroteHeader  bool
}

func newResponseRecorder(w http.ResponseWriter) *responseRecorder {
	return &responseRecorder{
		ResponseWriter: w,
		statusCode:     http.StatusOK,
	}
}

func (r *responseRecorder) WriteHeader(code int) {
	if r.wroteHeader {
		return
	}
	r.statusCode = code
	r.wroteHeader = true
	r.ResponseWriter.WriteHeader(code)
}

func (r *responseRecorder) Write(b []byte) (int, error) {
	if !r.wroteHeader {
		r.wroteHeader = true
	}
	n, err := r.ResponseWriter.Write(b)
	r.bytesWritten += int64(n)
	return n, err
}

func (r *responseRecorder) Flush() {
	if flusher, ok := r.ResponseWriter.(http.Flusher); ok {
		flusher.Flush()
	}
}

// LoggingMiddleware logs incoming HTTP requests and their responses.
func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		reqID := r.Header.Get("X-Request-ID")
		if reqID == "" {
			reqID = uuid.NewString()[:8]
		}
		w.Header().Set("X-Request-ID", reqID)

		slog.Info(fmt.Sprintf("[HTTP] --> %s %s from %s req_id=%s", r.Method, r.URL.Path, r.RemoteAddr, reqID))

		rec := newResponseRecorder(w)
		start := time.Now()

		next.ServeHTTP(rec, r)

		duration := time.Since(start)
		statusText := http.StatusText(rec.statusCode)

		if rec.statusCode >= 500 {
			slog.Error(fmt.Sprintf("[HTTP] <-- %s %s %d %s in %v req_id=%s bytes=%d",
				r.Method, r.URL.Path, rec.statusCode, statusText, duration, reqID, rec.bytesWritten))
		} else if rec.statusCode >= 400 {
			slog.Warn(fmt.Sprintf("[HTTP] <-- %s %s %d %s in %v req_id=%s bytes=%d",
				r.Method, r.URL.Path, rec.statusCode, statusText, duration, reqID, rec.bytesWritten))
		} else {
			slog.Info(fmt.Sprintf("[HTTP] <-- %s %s %d %s in %v req_id=%s bytes=%d",
				r.Method, r.URL.Path, rec.statusCode, statusText, duration, reqID, rec.bytesWritten))
		}
	})
}

// CORSMiddleware adds CORS headers and handles preflight OPTIONS requests.
func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// AuthMiddleware validates the Bearer token. An empty apiToken disables auth; config.Load only
// allows that with the explicit SUPERNOVA_INSECURE_NO_AUTH opt-in.
func AuthMiddleware(apiToken string) func(http.Handler) http.Handler {
	expected := []byte(apiToken)
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if apiToken == "" || r.Method == http.MethodOptions ||
				r.URL.Path == "/v1/health" || r.URL.Path == "/v1/health/" ||
				strings.HasPrefix(r.URL.Path, "/v1/webhooks/") {
				next.ServeHTTP(w, r)
				return
			}

			token, ok := strings.CutPrefix(r.Header.Get("Authorization"), "Bearer ")
			if !ok || subtle.ConstantTimeCompare([]byte(token), expected) != 1 {
				slog.Warn("[AUTH] Unauthorized request", "path", r.URL.Path, "remote", r.RemoteAddr, "has_bearer", ok)
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusUnauthorized)
				_ = json.NewEncoder(w).Encode(contracts.ErrorResponse{
					Code:    "UNAUTHORIZED",
					Message: "Invalid or missing Bearer token",
				})
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
