package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
	"sync"
	"time"
)

var (
	reSuffix  = regexp.MustCompile(`#.*$`)
	reSplit   = regexp.MustCompile(`[^a-zA-Z0-9]+`)
	reAcronym = regexp.MustCompile(`^[A-Z0-9]+$`)
	reCamel   = regexp.MustCompile(`([a-z0-9])([A-Z])`)
	reSafeKey = regexp.MustCompile(`[^a-zA-Z0-9_-]`)
	catalogMu sync.Mutex
)

// normalizeComponentName mirrors scripts/import-figma-components.js
func normalizeComponentName(rawName string) string {
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

// sanitizeFileName ensures no path traversal or dangerous characters in filenames
func sanitizeFileName(name string) string {
	cleaned := reSafeKey.ReplaceAllString(name, "")
	if cleaned == "" {
		return "unnamed"
	}
	return cleaned
}

// camelToKebab converts camelCase / PascalCase to kebab-case
func camelToKebab(s string) string {
	s = strings.TrimPrefix(s, "--")
	s = reCamel.ReplaceAllString(s, "${1}-${2}")
	s = strings.ToLower(s)
	s = strings.ReplaceAll(s, "_", "-")
	s = strings.ReplaceAll(s, "/", "-")
	return s
}

// findRepoRoot finds the repository root directory containing package.json
func findRepoRoot(startDir string) string {
	curr, err := filepath.Abs(startDir)
	if err != nil {
		return startDir
	}
	for i := 0; i < 5; i++ {
		pkgPath := filepath.Join(curr, "package.json")
		if _, err := os.Stat(pkgPath); err == nil {
			return curr
		}
		parent := filepath.Dir(curr)
		if parent == curr {
			break
		}
		curr = parent
	}
	return startDir
}

// corsMiddleware handles CORS headers and preflight OPTIONS requests
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

// writeJSON responds with formatted JSON
func writeJSON(w http.ResponseWriter, statusCode int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	encoder := json.NewEncoder(w)
	encoder.SetIndent("", "  ")
	if err := encoder.Encode(data); err != nil {
		log.Printf("Failed to encode JSON response: %v", err)
	}
}

// writeError responds with an error JSON payload
func writeError(w http.ResponseWriter, statusCode int, msg string) {
	writeJSON(w, statusCode, map[string]interface{}{
		"status":  "error",
		"message": msg,
	})
}

type Server struct {
	targetDir string
}

func NewServer(targetDir string) *Server {
	return &Server{
		targetDir: targetDir,
	}
}

// GET /api/health
func (s *Server) handleHealth(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"status":    "ok",
		"version":   "1.0.0",
		"targetDir": s.targetDir,
		"time":      time.Now().UTC().Format(time.RFC3339),
	})
}

// GET /api/status
func (s *Server) handleStatus(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	tokensTsPath := filepath.Join(s.targetDir, "tokens", "tokens.ts")
	tokensCssPath := filepath.Join(s.targetDir, "tokens", "tokens.css")
	themeCssPath := filepath.Join(s.targetDir, "tokens", "theme.css")
	figmaTokensJsonPath := filepath.Join(s.targetDir, "tokens", "figma-tokens.json")
	catalogPath := filepath.Join(s.targetDir, "components.catalog.json")
	fixturesDir := filepath.Join(s.targetDir, "scripts", "fixtures")
	rawTokensPath := filepath.Join(s.targetDir, "raw", "figma", "tokens-raw.json")
	rawComponentsPath := filepath.Join(s.targetDir, "raw", "figma", "components-raw.json")

	_, hasTokensTs := os.Stat(tokensTsPath)
	_, hasTokensCss := os.Stat(tokensCssPath)
	_, hasThemeCss := os.Stat(themeCssPath)
	_, hasFigmaTokensJson := os.Stat(figmaTokensJsonPath)
	_, hasRawTokens := os.Stat(rawTokensPath)
	_, hasRawComponents := os.Stat(rawComponentsPath)

	catalogCount := 0
	var catalogNames []string
	if data, err := os.ReadFile(catalogPath); err == nil {
		var catalog []map[string]interface{}
		if json.Unmarshal(data, &catalog) == nil {
			catalogCount = len(catalog)
			for _, item := range catalog {
				if name, ok := item["name"].(string); ok {
					catalogNames = append(catalogNames, name)
				}
			}
		}
	}

	fixturesCount := 0
	if entries, err := os.ReadDir(fixturesDir); err == nil {
		for _, e := range entries {
			if !e.IsDir() && strings.HasSuffix(e.Name(), ".figma.json") {
				fixturesCount++
			}
		}
	}

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"status": "ready",
		"tokens": map[string]interface{}{
			"hasTokensTs":        hasTokensTs == nil,
			"hasTokensCss":       hasTokensCss == nil,
			"hasThemeCss":        hasThemeCss == nil,
			"hasFigmaTokensJson": hasFigmaTokensJson == nil,
		},
		"catalog": map[string]interface{}{
			"exists": catalogCount > 0,
			"count":  catalogCount,
			"names":  catalogNames,
		},
		"fixtures": map[string]interface{}{
			"count": fixturesCount,
		},
		"raw": map[string]interface{}{
			"hasTokensRaw":     hasRawTokens == nil,
			"hasComponentsRaw": hasRawComponents == nil,
		},
		"targetDir": s.targetDir,
	})
}

// saveRawFile writes raw JSON payload to target file
func (s *Server) saveRawFile(relPath string, data interface{}) error {
	fullPath := filepath.Join(s.targetDir, relPath)
	if err := os.MkdirAll(filepath.Dir(fullPath), 0755); err != nil {
		return fmt.Errorf("failed to create dir: %w", err)
	}
	bytes, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal raw json: %w", err)
	}
	return os.WriteFile(fullPath, bytes, 0644)
}

// processTokens extracts, saves raw and normalized tokens, and writes tokens.ts, tokens.css, theme.css
func (s *Server) processTokens(payload map[string]interface{}) (map[string]interface{}, error) {
	// 1. Save raw data if present
	if rawVal, hasRaw := payload["raw"]; hasRaw && rawVal != nil {
		if err := s.saveRawFile("raw/figma/tokens-raw.json", rawVal); err != nil {
			log.Printf("[server] Warning: failed to save raw tokens: %v", err)
		}
	} else {
		// Save whole payload as raw tokens fallback
		if err := s.saveRawFile("raw/figma/tokens-raw.json", payload); err != nil {
			log.Printf("[server] Warning: failed to save raw tokens: %v", err)
		}
	}

	// 2. Identify normalized token dictionary
	var normalizedTokens map[string]interface{}
	if norm, ok := payload["tokens"].(map[string]interface{}); ok {
		normalizedTokens = norm
	} else if norm, ok := payload["normalized"].(map[string]interface{}); ok {
		normalizedTokens = norm
	} else {
		normalizedTokens = payload
	}

	tokensDir := filepath.Join(s.targetDir, "tokens")
	if err := os.MkdirAll(tokensDir, 0755); err != nil {
		return nil, fmt.Errorf("failed to create tokens directory: %w", err)
	}

	// 3. Save tokens/figma-tokens.json
	figmaTokensPath := filepath.Join(tokensDir, "figma-tokens.json")
	figmaTokensBytes, err := json.MarshalIndent(normalizedTokens, "", "  ")
	if err != nil {
		return nil, fmt.Errorf("failed to format figma-tokens.json: %w", err)
	}
	if err := os.WriteFile(figmaTokensPath, figmaTokensBytes, 0644); err != nil {
		return nil, fmt.Errorf("failed to write figma-tokens.json: %w", err)
	}

	// 4. Generate tokens.ts, tokens.css, theme.css
	if err := s.generateTokenCodeFiles(normalizedTokens, tokensDir); err != nil {
		return nil, fmt.Errorf("failed to generate token files: %w", err)
	}

	return map[string]interface{}{
		"figmaTokens": figmaTokensPath,
		"tokensTs":    filepath.Join(tokensDir, "tokens.ts"),
		"tokensCss":   filepath.Join(tokensDir, "tokens.css"),
		"themeCss":    filepath.Join(tokensDir, "theme.css"),
	}, nil
}

// generateTokenCodeFiles writes tokens.ts, tokens.css, and theme.css matching exporter format
func (s *Server) generateTokenCodeFiles(tokensMap map[string]interface{}, tokensDir string) error {
	// Prepare categorised token JSON for tokens.ts
	cleanTokens := make(map[string]interface{})
	for k, v := range tokensMap {
		if k == "raw" || k == "summary" || k == "tokens" {
			continue
		}
		cleanTokens[k] = v
	}

	jsonBytes, err := json.MarshalIndent(cleanTokens, "", "  ")
	if err != nil {
		return err
	}

	// 1. Write tokens.ts
	tokensTsContent := fmt.Sprintf("// This file was generated automatically by Supernova Sync Server. Do not edit directly.\n\nexport const tokens = %s as const;\n\nexport type Tokens = typeof tokens;\nexport default tokens;\n", string(jsonBytes))
	if err := os.WriteFile(filepath.Join(tokensDir, "tokens.ts"), []byte(tokensTsContent), 0644); err != nil {
		return err
	}

	// 2. Flatten tokens to CSS variables
	var cssVars []string
	var themeVars []string

	// Categories order
	categories := make([]string, 0, len(cleanTokens))
	for cat := range cleanTokens {
		categories = append(categories, cat)
	}
	sort.Strings(categories)

	for _, cat := range categories {
		val := cleanTokens[cat]
		if subMap, ok := val.(map[string]interface{}); ok {
			subKeys := make([]string, 0, len(subMap))
			for k := range subMap {
				subKeys = append(subKeys, k)
			}
			sort.Strings(subKeys)

			for _, key := range subKeys {
				itemVal := subMap[key]
				switch v := itemVal.(type) {
				case string:
					varName := "--" + camelToKebab(key)
					cssLine := fmt.Sprintf("  %s: %s;", varName, v)
					cssVars = append(cssVars, cssLine)
					themeVars = append(themeVars, cssLine)
				case float64:
					varName := "--" + camelToKebab(key)
					cssLine := fmt.Sprintf("  %s: %vpx;", varName, v)
					cssVars = append(cssVars, cssLine)
					themeVars = append(themeVars, cssLine)
				case map[string]interface{}:
					// Nested values like typography object
					for propK, propV := range v {
						varName := fmt.Sprintf("--%s-%s", camelToKebab(key), camelToKebab(propK))
						cssLine := fmt.Sprintf("  %s: %v;", varName, propV)
						cssVars = append(cssVars, cssLine)
						themeVars = append(themeVars, cssLine)
					}
				}
			}
		}
	}

	// 3. Write tokens.css
	tokensCssContent := fmt.Sprintf("/**\n * This file was generated automatically by Supernova Sync Server. Do not edit directly.\n */\n\n:root {\n%s\n}\n", strings.Join(cssVars, "\n"))
	if err := os.WriteFile(filepath.Join(tokensDir, "tokens.css"), []byte(tokensCssContent), 0644); err != nil {
		return err
	}

	// 4. Write theme.css (Tailwind CSS v4 @theme)
	themeCssContent := fmt.Sprintf("/**\n * This file was generated automatically by Supernova Sync Server. Do not edit directly.\n * Tailwind CSS v4 Theme Configuration\n * Usage in main css:\n *   @import \"tailwindcss\";\n *   @import \"./tokens/theme.css\";\n */\n\n@theme {\n%s\n}\n", strings.Join(themeVars, "\n"))
	if err := os.WriteFile(filepath.Join(tokensDir, "theme.css"), []byte(themeCssContent), 0644); err != nil {
		return err
	}

	return nil
}

// POST /api/tokens
func (s *Server) handleTokens(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		writeError(w, http.StatusBadRequest, "Failed to read request body")
		return
	}

	var payload map[string]interface{}
	if err := json.Unmarshal(body, &payload); err != nil {
		writeError(w, http.StatusBadRequest, fmt.Sprintf("Invalid JSON body: %v", err))
		return
	}

	result, err := s.processTokens(payload)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"status":  "ok",
		"message": "Tokens synchronized successfully",
		"files":   result,
	})
}

// processComponents handles catalog merging, fixture generation, and raw component files
func (s *Server) processComponents(payload map[string]interface{}) (map[string]interface{}, error) {
	// 1. Save raw components payload
	if rawVal, hasRaw := payload["raw"]; hasRaw && rawVal != nil {
		if err := s.saveRawFile("raw/figma/components-raw.json", rawVal); err != nil {
			log.Printf("[server] Warning: failed to save raw components: %v", err)
		}
	} else {
		if err := s.saveRawFile("raw/figma/components-raw.json", payload); err != nil {
			log.Printf("[server] Warning: failed to save raw components: %v", err)
		}
	}

	// 2. Extract component list
	var componentsList []interface{}
	if list, ok := payload["components"].([]interface{}); ok {
		componentsList = list
	} else if list, ok := payload["items"].([]interface{}); ok {
		componentsList = list
	} else {
		// Single component payload check
		if _, ok := payload["name"]; ok {
			componentsList = []interface{}{payload}
		}
	}

	if len(componentsList) == 0 {
		return nil, fmt.Errorf("no components provided in payload")
	}

	catalogMu.Lock()
	defer catalogMu.Unlock()

	// 3. Read existing components.catalog.json
	catalogPath := filepath.Join(s.targetDir, "components.catalog.json")
	var catalog []map[string]interface{}
	if data, err := os.ReadFile(catalogPath); err == nil {
		_ = json.Unmarshal(data, &catalog)
	}

	fixturesDir := filepath.Join(s.targetDir, "scripts", "fixtures")
	if err := os.MkdirAll(fixturesDir, 0755); err != nil {
		return nil, fmt.Errorf("failed to create fixtures dir: %w", err)
	}

	rawComponentsDir := filepath.Join(s.targetDir, "raw", "figma", "components")
	if err := os.MkdirAll(rawComponentsDir, 0755); err != nil {
		return nil, fmt.Errorf("failed to create raw components dir: %w", err)
	}

	nowIso := time.Now().UTC().Format(time.RFC3339)
	var processedNames []string

	for _, itemRaw := range componentsList {
		item, ok := itemRaw.(map[string]interface{})
		if !ok {
			continue
		}

		rawName, _ := item["rawName"].(string)
		if rawName == "" {
			rawName, _ = item["name"].(string)
		}
		if rawName == "" {
			rawName = "Component"
		}

		pascalName := normalizeComponentName(rawName)
		safeName := sanitizeFileName(pascalName)
		nodeId, _ := item["nodeId"].(string)
		if nodeId == "" {
			nodeId, _ = item["id"].(string)
		}
		sourceId, _ := item["sourceId"].(string)
		if sourceId == "" {
			sourceId, _ = item["key"].(string)
		}
		fileId, _ := item["fileId"].(string)
		desc, _ := item["description"].(string)

		compPropDefs := item["componentPropertyDefinitions"]
		if compPropDefs == nil {
			compPropDefs = []interface{}{}
		}
		variantPropVals := item["variantPropertyValues"]
		if variantPropVals == nil {
			variantPropVals = map[string]interface{}{}
		}
		variants := item["variants"]
		if variants == nil {
			variants = []interface{}{}
		}

		// Save fixture AST tree
		// Wrapped in { document: node, componentPropertyDefinitions: defs }
		var docNode interface{}
		if doc, ok := item["document"]; ok && doc != nil {
			docNode = doc
		} else if node, ok := item["node"]; ok && node != nil {
			docNode = node
		} else {
			docNode = item
		}

		fixtureData := map[string]interface{}{
			"document":                     docNode,
			"componentPropertyDefinitions": compPropDefs,
		}
		fixtureBytes, err := json.MarshalIndent(fixtureData, "", "  ")
		if err == nil {
			fixturePath := filepath.Join(fixturesDir, safeName+".figma.json")
			_ = os.WriteFile(fixturePath, fixtureBytes, 0644)
		}

		// Save individual raw component file
		rawCompBytes, err := json.MarshalIndent(item, "", "  ")
		if err == nil {
			rawCompPath := filepath.Join(rawComponentsDir, safeName+"-raw.json")
			_ = os.WriteFile(rawCompPath, rawCompBytes, 0644)
		}

		// Match existing catalog entry
		matchedIdx := -1
		for idx, existing := range catalog {
			exId, _ := existing["id"].(string)
			exNodeId, _ := existing["nodeId"].(string)
			exSourceId, _ := existing["sourceId"].(string)
			exName, _ := existing["name"].(string)
			exRawName, _ := existing["rawName"].(string)

			if (nodeId != "" && (exNodeId == nodeId || exId == nodeId)) ||
				(sourceId != "" && (exSourceId == sourceId || exId == sourceId)) ||
				strings.EqualFold(exName, pascalName) ||
				strings.EqualFold(exRawName, rawName) {
				matchedIdx = idx
				break
			}
		}

		if matchedIdx >= 0 {
			// Update existing entry while preserving custom metadata
			entry := catalog[matchedIdx]
			entry["rawName"] = rawName
			if desc != "" {
				entry["description"] = desc
			}
			entry["componentPropertyDefinitions"] = compPropDefs
			entry["variantPropertyValues"] = variantPropVals
			entry["updatedAt"] = nowIso

			figmaMap, _ := entry["figma"].(map[string]interface{})
			if figmaMap == nil {
				figmaMap = make(map[string]interface{})
			}
			if fileId != "" {
				figmaMap["fileId"] = fileId
			}
			if nodeId != "" {
				figmaMap["nodeId"] = nodeId
			}
			if sourceId != "" {
				figmaMap["sourceId"] = sourceId
				figmaMap["key"] = sourceId
			}
			figmaMap["name"] = rawName
			figmaMap["componentPropertyDefinitions"] = compPropDefs
			figmaMap["variantPropertyValues"] = variantPropVals
			figmaMap["variants"] = variants
			figmaMap["updatedAt"] = nowIso
			entry["figma"] = figmaMap
			catalog[matchedIdx] = entry
		} else {
			// Add new catalog entry
			idVal := sourceId
			if idVal == "" {
				idVal = nodeId
			}
			if idVal == "" {
				idVal = pascalName
			}

			newEntry := map[string]interface{}{
				"id":                           idVal,
				"name":                         pascalName,
				"rawName":                      rawName,
				"description":                  desc,
				"brandId":                      nil,
				"hasMitosisDefinition":         false,
				"fileId":                       fileId,
				"nodeId":                       nodeId,
				"sourceId":                     sourceId,
				"componentPropertyDefinitions": compPropDefs,
				"variantPropertyValues":        variantPropVals,
				"updatedAt":                    nowIso,
				"figma": map[string]interface{}{
					"fileId":                       fileId,
					"nodeId":                       nodeId,
					"sourceId":                     sourceId,
					"key":                          sourceId,
					"name":                         rawName,
					"thumbnailUrl":                 nil,
					"componentPropertyDefinitions": compPropDefs,
					"variantPropertyValues":        variantPropVals,
					"variants":                     variants,
					"updatedAt":                    nowIso,
				},
			}
			catalog = append(catalog, newEntry)
		}

		processedNames = append(processedNames, pascalName)
	}

	// 4. Save updated components.catalog.json
	catalogBytes, err := json.MarshalIndent(catalog, "", "  ")
	if err != nil {
		return nil, fmt.Errorf("failed to format catalog: %w", err)
	}
	if err := os.WriteFile(catalogPath, catalogBytes, 0644); err != nil {
		return nil, fmt.Errorf("failed to write catalog file: %w", err)
	}

	return map[string]interface{}{
		"processedCount": len(processedNames),
		"components":     processedNames,
		"catalogTotal":   len(catalog),
	}, nil
}

// POST /api/components
func (s *Server) handleComponents(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		writeError(w, http.StatusBadRequest, "Failed to read request body")
		return
	}

	// Support array of components directly or object
	var payload map[string]interface{}
	if err := json.Unmarshal(body, &payload); err != nil {
		var list []interface{}
		if errArr := json.Unmarshal(body, &list); errArr == nil {
			payload = map[string]interface{}{"components": list}
		} else {
			writeError(w, http.StatusBadRequest, fmt.Sprintf("Invalid JSON body: %v", err))
			return
		}
	}

	result, err := s.processComponents(payload)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"status":  "ok",
		"message": "Components synchronized successfully",
		"data":    result,
	})
}

// POST /api/sync
func (s *Server) handleSync(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		writeError(w, http.StatusBadRequest, "Failed to read request body")
		return
	}

	var payload map[string]interface{}
	if err := json.Unmarshal(body, &payload); err != nil {
		writeError(w, http.StatusBadRequest, fmt.Sprintf("Invalid JSON body: %v", err))
		return
	}

	// Save overall raw sync payload
	if err := s.saveRawFile("raw/figma/sync-raw.json", payload); err != nil {
		log.Printf("[server] Warning: failed to save raw sync payload: %v", err)
	}

	response := map[string]interface{}{
		"status": "ok",
	}

	// Process tokens if present
	if tokensVal, ok := payload["tokens"]; ok && tokensVal != nil {
		tokenPayload := map[string]interface{}{
			"tokens": tokensVal,
		}
		if rawTokens, hasRaw := payload["rawTokens"]; hasRaw {
			tokenPayload["raw"] = rawTokens
		}
		tokenRes, err := s.processTokens(tokenPayload)
		if err != nil {
			writeError(w, http.StatusInternalServerError, fmt.Sprintf("Token sync failed: %v", err))
			return
		}
		response["tokens"] = tokenRes
	}

	// Process components if present
	if compsVal, ok := payload["components"]; ok && compsVal != nil {
		compPayload := map[string]interface{}{
			"components": compsVal,
		}
		if rawComps, hasRaw := payload["rawComponents"]; hasRaw {
			compPayload["raw"] = rawComps
		}
		compRes, err := s.processComponents(compPayload)
		if err != nil {
			writeError(w, http.StatusInternalServerError, fmt.Sprintf("Component sync failed: %v", err))
			return
		}
		response["components"] = compRes
	}

	// Auto-trigger Mitosis compilation if requested
	if gen, ok := payload["generate"].(bool); ok && gen {
		cmd := exec.Command("npm", "run", "figma:sync")
		cmd.Dir = s.targetDir
		var outBuf, errBuf bytes.Buffer
		cmd.Stdout = &outBuf
		cmd.Stderr = &errBuf
		cmdErr := cmd.Run()

		genOutput := outBuf.String()
		if cmdErr != nil {
			genOutput += "\n[Error]: " + errBuf.String()
			response["generateSuccess"] = false
		} else {
			response["generateSuccess"] = true
		}
		response["generateOutput"] = genOutput
	}

	writeJSON(w, http.StatusOK, response)
}

func main() {
	var portFlag = flag.String("port", "", "Port for the HTTP server")
	var targetFlag = flag.String("target", "", "Target repository directory")
	flag.Parse()

	port := *portFlag
	if port == "" {
		port = os.Getenv("PORT")
	}
	if port == "" {
		port = "8080"
	}

	targetDir := *targetFlag
	if targetDir == "" {
		targetDir = os.Getenv("TARGET_DIR")
	}
	if targetDir == "" {
		// Look for repo root
		cwd, _ := os.Getwd()
		targetDir = findRepoRoot(cwd)
	}

	absTarget, err := filepath.Abs(targetDir)
	if err == nil {
		targetDir = absTarget
	}

	server := NewServer(targetDir)

	mux := http.NewServeMux()
	mux.HandleFunc("/api/health", server.handleHealth)
	mux.HandleFunc("/api/status", server.handleStatus)
	mux.HandleFunc("/api/tokens", server.handleTokens)
	mux.HandleFunc("/api/components", server.handleComponents)
	mux.HandleFunc("/api/sync", server.handleSync)

	handler := corsMiddleware(mux)

	addr := ":" + port
	log.Printf("==================================================")
	log.Printf(" Supernova Sync Server running on port %s", port)
	log.Printf(" Target Directory: %s", targetDir)
	log.Printf(" Health:      http://localhost:%s/api/health", port)
	log.Printf(" Status:      http://localhost:%s/api/status", port)
	log.Printf(" Tokens:      POST http://localhost:%s/api/tokens", port)
	log.Printf(" Components:  POST http://localhost:%s/api/components", port)
	log.Printf(" Sync:        POST http://localhost:%s/api/sync", port)
	log.Printf("==================================================")

	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
