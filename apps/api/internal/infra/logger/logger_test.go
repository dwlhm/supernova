package logger_test

import (
	"bytes"
	"context"
	"log/slog"
	"os"
	"strings"
	"testing"
	"time"

	"github.com/dwlhm/supernova/apps/api/internal/infra/logger"
)

func TestMaskSecret(t *testing.T) {
	tests := []struct {
		input    string
		expected string
	}{
		{"", ""},
		{"short", "***"},
		{"12345678", "***"},
		{"123456789", "1234...6789"},
		{"ghp_0123456789abcdef", "ghp_...cdef"},
	}

	for _, tt := range tests {
		actual := logger.MaskSecret(tt.input)
		if actual != tt.expected {
			t.Errorf("MaskSecret(%q) = %q, expected %q", tt.input, actual, tt.expected)
		}
	}
}

func TestConsoleHandler(t *testing.T) {
	os.Setenv("NO_COLOR", "1")
	defer os.Unsetenv("NO_COLOR")

	var buf bytes.Buffer
	handler := logger.NewConsoleHandler(&buf, &slog.HandlerOptions{
		Level: slog.LevelDebug,
	})
	testLogger := slog.New(handler)

	fixedTime := time.Date(2025, 5, 20, 10, 0, 0, 0, time.UTC)
	rec := slog.NewRecord(fixedTime, slog.LevelInfo, "test info message", 0)
	_ = handler.Handle(context.Background(), rec)

	output := buf.String()
	if !strings.Contains(output, "[INFO ]") {
		t.Errorf("expected [INFO ] in output, got: %s", output)
	}
	if !strings.Contains(output, "test info message") {
		t.Errorf("expected message in output, got: %s", output)
	}

	buf.Reset()
	testLogger.Error("test error message", slog.String("key", "val"))
	output = buf.String()
	if !strings.Contains(output, "[ERROR]") {
		t.Errorf("expected [ERROR] in output, got: %s", output)
	}
	if !strings.Contains(output, "key=val") {
		t.Errorf("expected key=val attribute in output, got: %s", output)
	}
}
