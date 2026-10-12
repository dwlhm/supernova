package http

import (
	"net/http"
	"strings"

	"github.com/dwlhm/supernova/apps/api/internal/core/port/in"
)

// NewRouter constructs and configures the HTTP router with endpoints and middleware.
func NewRouter(svc in.Service, apiToken string) http.Handler {
	h := NewHandler(svc)
	mux := http.NewServeMux()

	mux.HandleFunc("GET /v1/health", h.HandleHealth)
	mux.HandleFunc("POST /v1/extractions", h.HandleSubmitExtraction)
	mux.HandleFunc("POST /v1/extractions/replay", h.HandleReplayExtraction)

	mux.HandleFunc("GET /v1/jobs/", func(w http.ResponseWriter, r *http.Request) {
		subpath := strings.TrimPrefix(r.URL.Path, "/v1/jobs/")
		if subpath == "" {
			http.NotFound(w, r)
			return
		}

		if strings.HasSuffix(subpath, "/download") {
			h.HandleDownloadZip(w, r)
			return
		}

		h.HandleGetJob(w, r)
	})

	var handler http.Handler = mux
	handler = AuthMiddleware(apiToken)(handler)
	handler = CORSMiddleware(handler)
	handler = LoggingMiddleware(handler)

	return handler
}
