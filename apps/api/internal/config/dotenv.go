package config

import (
	"os"
	"strings"
)

// LoadDotEnv sets variables from a KEY=VALUE file without overriding the existing environment.
// A missing file is not an error: production deployments inject the environment directly.
func LoadDotEnv(path string) error {
	data, err := os.ReadFile(path)
	if os.IsNotExist(err) {
		return nil
	}
	if err != nil {
		return err
	}
	for _, line := range strings.Split(string(data), "\n") {
		line = strings.TrimSpace(strings.TrimPrefix(strings.TrimSpace(line), "export "))
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		key, val, ok := strings.Cut(line, "=")
		if !ok {
			continue
		}
		key = strings.TrimSpace(key)
		if _, exists := os.LookupEnv(key); exists {
			continue
		}
		if err := os.Setenv(key, strings.Trim(strings.TrimSpace(val), `"'`)); err != nil {
			return err
		}
	}
	return nil
}
