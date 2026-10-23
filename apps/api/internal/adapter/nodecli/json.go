package nodecli

import (
	"bytes"
	"encoding/json"
)

// ExtractJSON returns the CLI's JSON response from stdout, tolerating stray log lines that
// dependencies may print before or after it.
func ExtractJSON(data []byte) []byte {
	trimmed := bytes.TrimSpace(data)
	if json.Valid(trimmed) {
		return trimmed
	}
	start := bytes.IndexByte(trimmed, '{')
	end := bytes.LastIndexByte(trimmed, '}')
	if start != -1 && end != -1 && end > start {
		candidate := trimmed[start : end+1]
		if json.Valid(candidate) {
			return candidate
		}
	}
	// If there are multiple JSON-like chunks (e.g. error replacing { ... } then {"success": ...}),
	// locate {"success" or "success" key
	if idx := bytes.Index(trimmed, []byte(`"success"`)); idx != -1 {
		startCandidate := bytes.LastIndexByte(trimmed[:idx], '{')
		if startCandidate != -1 && end > startCandidate {
			candidate := trimmed[startCandidate : end+1]
			if json.Valid(candidate) {
				return candidate
			}
		}
	}
	return trimmed
}
