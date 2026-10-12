package logger

import (
	"context"
	"fmt"
	"io"
	"log/slog"
	"os"
	"sync"
	"time"
)

// ConsoleHandler formats log records into a high-visibility text layout for console inspection.
type ConsoleHandler struct {
	opts   slog.HandlerOptions
	out    io.Writer
	mu     *sync.Mutex
	attrs  []slog.Attr
	groups []string
}

// NewConsoleHandler returns a new ConsoleHandler writing to out.
func NewConsoleHandler(out io.Writer, opts *slog.HandlerOptions) *ConsoleHandler {
	var opt slog.HandlerOptions
	if opts != nil {
		opt = *opts
	}
	if out == nil {
		out = os.Stdout
	}
	return &ConsoleHandler{
		opts: opt,
		out:  out,
		mu:   &sync.Mutex{},
	}
}

// Enabled reports whether the handler emits log records at the given level.
func (h *ConsoleHandler) Enabled(_ context.Context, level slog.Level) bool {
	minLevel := slog.LevelInfo
	if h.opts.Level != nil {
		minLevel = h.opts.Level.Level()
	}
	return level >= minLevel
}

// Handle outputs the formatted log record.
func (h *ConsoleHandler) Handle(_ context.Context, r slog.Record) error {
	noColor := os.Getenv("NO_COLOR") != ""
	var badge string

	switch {
	case r.Level >= slog.LevelError:
		if noColor {
			badge = "[ERROR]"
		} else {
			badge = "\033[1;31m[ERROR]\033[0m"
		}
	case r.Level >= slog.LevelWarn:
		if noColor {
			badge = "[WARN ]"
		} else {
			badge = "\033[1;33m[WARN ]\033[0m"
		}
	case r.Level >= slog.LevelInfo:
		if noColor {
			badge = "[INFO ]"
		} else {
			badge = "\033[1;32m[INFO ]\033[0m"
		}
	default:
		if noColor {
			badge = "[DEBUG]"
		} else {
			badge = "\033[1;36m[DEBUG]\033[0m"
		}
	}

	t := r.Time
	if t.IsZero() {
		t = time.Now()
	}
	timeStr := t.Format("2006-01-02 15:04:05.000")

	var attrsStr string
	appendAttr := func(a slog.Attr) {
		if a.Key == "" {
			return
		}
		attrsStr += fmt.Sprintf(" %s=%v", a.Key, a.Value.Any())
	}
	for _, a := range h.attrs {
		appendAttr(a)
	}
	r.Attrs(func(a slog.Attr) bool {
		appendAttr(a)
		return true
	})

	line := fmt.Sprintf("%s %s %s%s\n", timeStr, badge, r.Message, attrsStr)

	h.mu.Lock()
	defer h.mu.Unlock()
	_, err := io.WriteString(h.out, line)
	return err
}

// WithAttrs returns a new handler whose attributes consist of h's attributes followed by attrs.
func (h *ConsoleHandler) WithAttrs(attrs []slog.Attr) slog.Handler {
	newAttrs := make([]slog.Attr, len(h.attrs)+len(attrs))
	copy(newAttrs, h.attrs)
	copy(newAttrs[len(h.attrs):], attrs)

	return &ConsoleHandler{
		opts:   h.opts,
		out:    h.out,
		mu:     h.mu,
		attrs:  newAttrs,
		groups: h.groups,
	}
}

// WithGroup returns a new handler with the given group appended.
func (h *ConsoleHandler) WithGroup(name string) slog.Handler {
	newGroups := make([]string, len(h.groups)+1)
	copy(newGroups, h.groups)
	newGroups[len(h.groups)] = name

	return &ConsoleHandler{
		opts:   h.opts,
		out:    h.out,
		mu:     h.mu,
		attrs:  h.attrs,
		groups: newGroups,
	}
}

// Init initializes the default slog logger with a high-visibility ConsoleHandler.
func Init(level slog.Level) {
	handler := NewConsoleHandler(os.Stdout, &slog.HandlerOptions{
		Level: level,
	})
	slog.SetDefault(slog.New(handler))
}

// MaskSecret masks sensitive credentials or tokens.
// If length > 8 returns s[:4] + "..." + s[len(s)-4:], otherwise "***".
func MaskSecret(s string) string {
	if s == "" {
		return ""
	}
	if len(s) > 8 {
		return s[:4] + "..." + s[len(s)-4:]
	}
	return "***"
}
