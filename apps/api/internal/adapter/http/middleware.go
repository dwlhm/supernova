package http

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"strings"
	"time"

	"github.com/dwlhm/supernova/apps/api/internal/infra/logger"
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

// AuthMiddleware validates the Bearer token when apiToken is configured.
func AuthMiddleware(apiToken string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if apiToken == "" {
				next.ServeHTTP(w, r)
				return
			}

			if r.URL.Path == "/v1/health" || r.URL.Path == "/v1/health/" {
				next.ServeHTTP(w, r)
				return
			}

			if r.Method == http.MethodOptions {
				next.ServeHTTP(w, r)
				return
			}

			authHeader := r.Header.Get("Authorization")
			token := strings.TrimPrefix(authHeader, "Bearer ")

			if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") || token != apiToken {
				masked := logger.MaskSecret(token)
				slog.Warn(fmt.Sprintf("[AUTH] [WARN] Unauthorized request to %s: missing or invalid Bearer token (token preview: %s)", r.URL.Path, masked))
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
