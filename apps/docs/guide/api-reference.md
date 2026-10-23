# Backend API Reference

The Go backend (`apps/api`) exposes OpenAPI 3.0.3 endpoints under `/v1/`.

## Endpoints

### 1. Health Check
`GET /v1/health`

Returns service health status. Public endpoint (bypasses Bearer authentication).

**Response (200 OK):**
```json
{
  "status": "ok",
  "version": "1.0.0"
}
```

---

### 2. Submit Extraction
`POST /v1/extractions`

Submits an extracted Figma document payload for asynchronous component authoring and compilation.

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer <token>` (required; auth can only be disabled locally with `SUPERNOVA_INSECURE_NO_AUTH=true`)

**Request Body:**
```json
{
  "document": {
    "name": "Design System",
    "tokens": [
      {
        "id": "token-1",
        "name": "color/primary",
        "type": "color",
        "value": "#18a0fb"
      }
    ],
    "components": [
      {
        "id": "comp-1",
        "name": "Button",
        "node": {
          "layout": { "width": 120, "height": 40 }
        }
      }
    ]
  },
  "targets": ["react", "svelte", "vue3", "vue2", "angular"],
  "publishers": ["download", "pull_request"]
}
```

**Response (202 Accepted):**
```json
{
  "jobId": "b18f0a20-41a6-4bdf-89ea-e26e03ea7e20",
  "status": "queued",
  "createdAt": "2026-10-07T12:00:00Z"
}
```

---

### 3. Get Job Status
`GET /v1/jobs/{id}`

Polls the progress of an extraction job.

**Response (200 OK):**
```json
{
  "jobId": "b18f0a20-41a6-4bdf-89ea-e26e03ea7e20",
  "status": "succeeded",
  "targets": ["react", "svelte", "vue3", "vue2", "angular"],
  "publishers": ["download"],
  "components": [
    {
      "name": "Button",
      "status": "done"
    }
  ],
  "publishResults": {
    "downloadUrl": "/v1/jobs/b18f0a20-41a6-4bdf-89ea-e26e03ea7e20/download",
    "pullRequestUrl": "https://github.com/org/repo/pull/42"
  },
  "createdAt": "2026-10-07T12:00:00Z",
  "updatedAt": "2026-10-07T12:00:15Z"
}
```

---

### 4. Download Artifacts Bundle
`GET /v1/jobs/{id}/download`

Downloads a zip archive containing all generated component files organized by framework folder (`react/`, `svelte/`, `vue3/`, `vue2/`, `angular/`).

**Response (200 OK):**
- `Content-Type: application/zip`
- `Content-Disposition: attachment; filename="components.zip"`
