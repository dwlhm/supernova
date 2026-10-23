package domain

import (
	"regexp"
	"strings"
)

var (
	reSuffix  = regexp.MustCompile(`#.*$`)
	reSplit   = regexp.MustCompile(`[^a-zA-Z0-9]+`)
	reAcronym = regexp.MustCompile(`^[A-Z0-9]+$`)
	reCamel   = regexp.MustCompile(`([a-z0-9])([A-Z])`)
)

// NormalizeComponentName sanitizes a raw Figma component name into a valid PascalCase identifier.
// It mirrors legacy behavior, stripping trailing hash suffixes and non-alphanumeric separators.
func NormalizeComponentName(rawName string) string {
	clean := strings.TrimSpace(reSuffix.ReplaceAllString(rawName, ""))
	if clean == "" {
		return "Component"
	}

	parts := reSplit.Split(clean, -1)
	var filtered []string
	for _, p := range parts {
		if p != "" {
			filtered = append(filtered, p)
		}
	}
	if len(filtered) == 0 {
		return "Component"
	}

	var res strings.Builder
	for _, part := range filtered {
		if reAcronym.MatchString(part) {
			res.WriteString(part)
		} else {
			res.WriteString(strings.ToUpper(part[:1]) + part[1:])
		}
	}

	result := res.String()
	if result == "" {
		return "Component"
	}
	return result
}

// CamelToKebab converts camelCase or PascalCase strings to kebab-case.
func CamelToKebab(s string) string {
	s = strings.TrimPrefix(s, "--")
	s = reCamel.ReplaceAllString(s, "${1}-${2}")
	s = strings.ToLower(s)
	s = strings.ReplaceAll(s, "_", "-")
	s = strings.ReplaceAll(s, "/", "-")
	return s
}
