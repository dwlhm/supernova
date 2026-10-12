package app

import (
	"encoding/json"
	"fmt"
	"math"
	"sort"
	"strconv"
	"strings"
	"unicode"

	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

const (
	categoryColor   = "color"
	categoryRadius  = "radius"
	categoryShadow  = "shadow"
	categorySpacing = "spacing"
	categoryFont    = "font"
	categoryCustom  = "custom"
)

// Token tiers, identified by the kebab form of a token name's leading segment
// (e.g. "🌱 Semantic" -> "semantic", "🌍 Primitive" -> "primitive").
const (
	tierSemantic   = "semantic"
	tierPrimitive  = "primitive"
	tierPrimitives = "primitives"
)

// Collision priority per tier: a Semantic token wins over an untiered token,
// which wins over a Primitive token, when they map to the same CSS variable.
const (
	tierPriorityPrimitive = iota
	tierPriorityDefault
	tierPrioritySemantic
)

// Tailwind v4 utility prefixes generated from @theme variables, grouped by role.
var (
	colorUtilitiesBackground = []string{"bg"}
	colorUtilitiesForeground = []string{"text", "fill", "stroke", "placeholder"}
	colorUtilitiesBorder     = []string{"border", "divide", "outline"}
	colorUtilitiesFocus      = []string{"ring", "outline"}
	colorUtilitiesChart      = []string{"bg", "fill", "stroke", "text"}
	colorUtilitiesComponents = []string{"bg", "text", "border", "fill", "stroke"}
	colorUtilitiesDefault    = []string{"bg", "text", "border", "ring", "fill", "stroke"}

	// colorUtilitiesByRole maps the first kebab segment of a color token name to
	// the utilities that make sense for that role. Unlisted roles use colorUtilitiesDefault.
	colorUtilitiesByRole = map[string][]string{
		"background": colorUtilitiesBackground,
		"foreground": colorUtilitiesForeground,
		"border":     colorUtilitiesBorder,
		"focus":      colorUtilitiesFocus,
		"chart":      colorUtilitiesChart,
		"overlay":    colorUtilitiesBackground,
		"components": colorUtilitiesComponents,
	}

	radiusUtilities  = []string{"rounded"}
	shadowUtilities  = []string{"shadow"}
	spacingUtilities = []string{"p", "px", "py", "m", "gap"}
)

// ResolveTokens resolves all VARIABLE_ALIAS values in the provided tokens into
// their final resolved values (colors, floats, strings, etc.) using an ID-to-token map,
// with recursive cycle detection. Colors represented as {r, g, b, a} float maps
// are converted into valid hex strings (#rrggbb or #rrggbbaa).
func ResolveTokens(tokens []contracts.FigmaToken) []contracts.FigmaToken {
	if len(tokens) == 0 {
		return []contracts.FigmaToken{}
	}

	tokenMap := make(map[string]contracts.FigmaToken, len(tokens)*2)
	for _, tok := range tokens {
		if tok.Id != "" {
			tokenMap[tok.Id] = tok
			if strings.HasPrefix(tok.Id, "VariableID:") {
				tokenMap[strings.TrimPrefix(tok.Id, "VariableID:")] = tok
			} else {
				tokenMap["VariableID:"+tok.Id] = tok
			}
		}
	}

	var resolveValue func(val interface{}, visited map[string]bool) interface{}
	resolveValue = func(val interface{}, visited map[string]bool) interface{} {
		if val == nil {
			return nil
		}

		if aliasID, isAlias := getAliasID(val); isAlias {
			if visited[aliasID] {
				// Cycle detected; return unresolved value to terminate recursion safely
				return val
			}
			visited[aliasID] = true
			targetTok, exists := tokenMap[aliasID]
			if !exists {
				return val
			}
			return resolveValue(targetTok.Value, visited)
		}

		if m, ok := val.(map[string]interface{}); ok {
			if hexStr, isColor := formatColorMap(m); isColor {
				return hexStr
			}
		}

		return val
	}

	resolved := make([]contracts.FigmaToken, len(tokens))
	for i, tok := range tokens {
		visited := make(map[string]bool)
		if tok.Id != "" {
			visited[tok.Id] = true
			if strings.HasPrefix(tok.Id, "VariableID:") {
				visited[strings.TrimPrefix(tok.Id, "VariableID:")] = true
			} else {
				visited["VariableID:"+tok.Id] = true
			}
		}

		tokCopy := tok
		tokCopy.Value = resolveValue(tok.Value, visited)
		resolved[i] = tokCopy
	}

	return resolved
}

// GenerateThemeCSS generates a Tailwind CSS v4 @theme block containing
// --color-*, --radius-*, --shadow-*, etc. with kebab-cased properties.
func GenerateThemeCSS(tokens []contracts.FigmaToken) string {
	varMap := buildCSSVarMap(tokens)

	if len(varMap) == 0 {
		return "@theme {}\n"
	}

	names := make([]string, 0, len(varMap))
	for name := range varMap {
		names = append(names, name)
	}
	sort.Strings(names)

	var sb strings.Builder
	sb.WriteString("@theme {\n")
	for _, name := range names {
		sb.WriteString("  ")
		sb.WriteString(name)
		sb.WriteString(": ")
		sb.WriteString(varMap[name])
		sb.WriteString(";\n")
	}
	sb.WriteString("}\n")

	return sb.String()
}

// GenerateTokensCSS generates standard :root { ... } CSS variables for all tokens.
func GenerateTokensCSS(tokens []contracts.FigmaToken) string {
	varMap := buildCSSVarMap(tokens)

	if len(varMap) == 0 {
		return ":root {}\n"
	}

	names := make([]string, 0, len(varMap))
	for name := range varMap {
		names = append(names, name)
	}
	sort.Strings(names)

	var sb strings.Builder
	sb.WriteString(":root {\n")
	for _, name := range names {
		sb.WriteString("  ")
		sb.WriteString(name)
		sb.WriteString(": ")
		sb.WriteString(varMap[name])
		sb.WriteString(";\n")
	}
	sb.WriteString("}\n")

	return sb.String()
}

// GenerateTokensTS generates a TypeScript tokens definition file exporting a 'tokens'
// object with 'as const' and an exported 'Tokens' type.
func GenerateTokensTS(tokens []contracts.FigmaToken) string {
	if len(tokens) == 0 {
		return "export const tokens = {} as const;\n\nexport type Tokens = typeof tokens;\n"
	}

	resolved := ResolveTokens(tokens)

	categoryMap := make(map[string]map[string]string)

	for _, tok := range resolved {
		cat := detectCategory(tok)
		tsCat := mapCategoryToTSKey(cat)
		key := sanitizeTokenKey(tok, cat)
		if key == "" {
			continue
		}
		valStr := serializeTSValue(tok.Value)

		if categoryMap[tsCat] == nil {
			categoryMap[tsCat] = make(map[string]string)
		}
		categoryMap[tsCat][key] = valStr
	}

	if len(categoryMap) == 0 {
		return "export const tokens = {} as const;\n\nexport type Tokens = typeof tokens;\n"
	}

	catKeys := make([]string, 0, len(categoryMap))
	for cat := range categoryMap {
		catKeys = append(catKeys, cat)
	}
	sort.Strings(catKeys)

	var sb strings.Builder
	sb.WriteString("export const tokens = {\n")

	for _, cat := range catKeys {
		tokensInCat := categoryMap[cat]
		if len(tokensInCat) == 0 {
			continue
		}

		sb.WriteString("  ")
		sb.WriteString(cat)
		sb.WriteString(": {\n")

		tokenKeys := make([]string, 0, len(tokensInCat))
		for k := range tokensInCat {
			tokenKeys = append(tokenKeys, k)
		}
		sort.Strings(tokenKeys)

		for _, k := range tokenKeys {
			sb.WriteString("    ")
			sb.WriteString(formatTSPropertyKey(k))
			sb.WriteString(": ")
			sb.WriteString(tokensInCat[k])
			sb.WriteString(",\n")
		}

		sb.WriteString("  },\n")
	}

	sb.WriteString("} as const;\n\nexport type Tokens = typeof tokens;\n")

	return sb.String()
}

// ExtractTailwindUtilityClasses returns the list of available Tailwind utility classes
// (e.g. bg-background-primary-faded, text-foreground-primary, border-border-neutral, rounded-sm, shadow-md, etc.)
// derived from the provided design tokens. Every class maps to a CSS variable emitted by
// tokenToCSS. Primitive-tier tokens are skipped so components bind to semantic tokens only.
func ExtractTailwindUtilityClasses(tokens []contracts.FigmaToken) []string {
	resolved := ResolveTokens(tokens)
	classMap := make(map[string]bool)

	for _, tok := range resolved {
		if tokenTierPriority(tok) == tierPriorityPrimitive {
			continue
		}
		varName, _, ok := tokenToCSS(tok)
		if !ok {
			continue
		}
		cat := detectCategory(tok)
		kebab := strings.TrimPrefix(varName, cssVarPrefix(cat))

		for _, utility := range utilitiesForToken(cat, kebab) {
			classMap[utility+"-"+kebab] = true
		}
	}

	classes := make([]string, 0, len(classMap))
	for c := range classMap {
		classes = append(classes, c)
	}
	sort.Strings(classes)

	return classes
}

// --- Internal Helpers ---

// buildCSSVarMap resolves tokens and maps each CSS variable name to its value.
// When several tokens map to the same variable, the higher tier priority wins
// (see tokenTierPriority); ties keep the last token in input order.
func buildCSSVarMap(tokens []contracts.FigmaToken) map[string]string {
	resolved := ResolveTokens(tokens)
	varMap := make(map[string]string)
	priorities := make(map[string]int)

	for _, tok := range resolved {
		name, val, ok := tokenToCSS(tok)
		if !ok {
			continue
		}
		prio := tokenTierPriority(tok)
		if existing, seen := priorities[name]; seen && prio < existing {
			continue
		}
		varMap[name] = val
		priorities[name] = prio
	}

	return varMap
}

// tokenTier returns the kebab form of the token name's leading segment when the
// name has more than one segment (e.g. "🌱 Semantic/colors/x" -> "semantic").
func tokenTier(token contracts.FigmaToken) string {
	segments := strings.Split(strings.TrimSpace(token.Name), "/")
	if len(segments) < 2 {
		return ""
	}
	return toKebabCase(segments[0])
}

func isStrippableTier(tier string) bool {
	return tier == tierSemantic || tier == tierPrimitive || tier == tierPrimitives
}

// tokenTierPriority ranks a token for CSS variable collisions: semantic > other > primitive.
func tokenTierPriority(token contracts.FigmaToken) int {
	switch tokenTier(token) {
	case tierSemantic:
		return tierPrioritySemantic
	case tierPrimitive, tierPrimitives:
		return tierPriorityPrimitive
	default:
		return tierPriorityDefault
	}
}

// utilitiesForToken returns the Tailwind utility prefixes generated for a token's
// CSS variable, based on its category and (for colors) its role segment.
func utilitiesForToken(cat, kebab string) []string {
	switch cat {
	case categoryColor:
		role := strings.SplitN(kebab, "-", 2)[0]
		if utilities, ok := colorUtilitiesByRole[role]; ok {
			return utilities
		}
		return colorUtilitiesDefault
	case categoryRadius:
		return radiusUtilities
	case categoryShadow:
		return shadowUtilities
	case categorySpacing:
		return spacingUtilities
	default:
		return nil
	}
}

func getAliasID(val interface{}) (string, bool) {
	if val == nil {
		return "", false
	}
	m, ok := val.(map[string]interface{})
	if !ok {
		return "", false
	}

	var typeStr string
	if t, ok := m["type"].(string); ok {
		typeStr = t
	} else if t, ok := m["Type"].(string); ok {
		typeStr = t
	}
	if !strings.EqualFold(typeStr, "VARIABLE_ALIAS") {
		return "", false
	}

	var idStr string
	if id, ok := m["id"].(string); ok {
		idStr = id
	} else if id, ok := m["Id"].(string); ok {
		idStr = id
	}
	return idStr, idStr != ""
}

func getFloat(m map[string]interface{}, keys ...string) (float64, bool) {
	for _, k := range keys {
		if v, ok := m[k]; ok && v != nil {
			switch num := v.(type) {
			case float64:
				return num, true
			case float32:
				return float64(num), true
			case int:
				return float64(num), true
			case int64:
				return float64(num), true
			}
		}
	}
	return 0, false
}

func clampInt(val, min, max int) int {
	if val < min {
		return min
	}
	if val > max {
		return max
	}
	return val
}

func formatColorMap(m map[string]interface{}) (string, bool) {
	r, okR := getFloat(m, "r", "R")
	g, okG := getFloat(m, "g", "G")
	b, okB := getFloat(m, "b", "B")
	if !okR || !okG || !okB {
		return "", false
	}

	a, okA := getFloat(m, "a", "A", "opacity", "alpha")
	if !okA {
		a = 1.0
	}

	var rInt, gInt, bInt int
	if r <= 1.0 && g <= 1.0 && b <= 1.0 {
		rInt = int(math.Round(r * 255.0))
		gInt = int(math.Round(g * 255.0))
		bInt = int(math.Round(b * 255.0))
	} else {
		rInt = int(math.Round(r))
		gInt = int(math.Round(g))
		bInt = int(math.Round(b))
	}
	rInt = clampInt(rInt, 0, 255)
	gInt = clampInt(gInt, 0, 255)
	bInt = clampInt(bInt, 0, 255)

	if a > 1.0 {
		a = a / 100.0
	}
	if a < 0 {
		a = 0
	} else if a > 1.0 {
		a = 1.0
	}

	if a >= 0.999 {
		return fmt.Sprintf("#%02x%02x%02x", rInt, gInt, bInt), true
	}
	aInt := int(math.Round(a * 255.0))
	return fmt.Sprintf("#%02x%02x%02x%02x", rInt, gInt, bInt, aInt), true
}

func formatShadowMap(m map[string]interface{}) string {
	x, _ := getFloat(m, "x", "X")
	y, _ := getFloat(m, "y", "Y")
	if offset, ok := m["offset"].(map[string]interface{}); ok {
		x, _ = getFloat(offset, "x", "X")
		y, _ = getFloat(offset, "y", "Y")
	}
	radius, _ := getFloat(m, "radius", "Radius", "blur", "Blur")
	spread, okSpread := getFloat(m, "spread", "Spread")

	var colorStr string
	if c, ok := m["color"].(string); ok {
		colorStr = c
	} else if cMap, ok := m["color"].(map[string]interface{}); ok {
		colorStr, _ = formatColorMap(cMap)
	}
	if colorStr == "" {
		colorStr = "rgba(0, 0, 0, 0.15)"
	}

	if okSpread {
		return fmt.Sprintf("%gpx %gpx %gpx %gpx %s", x, y, radius, spread, colorStr)
	}
	return fmt.Sprintf("%gpx %gpx %gpx %s", x, y, radius, colorStr)
}

func detectCategory(token contracts.FigmaToken) string {
	typ := strings.ToLower(token.Type)
	name := strings.ToLower(token.Name)

	if typ == "radius" || typ == "corner-radius" || typ == "cornerradius" || typ == "border-radius" || typ == "borderradius" ||
		strings.Contains(name, "radius") || strings.Contains(name, "radii") {
		return categoryRadius
	}

	if typ == "shadow" || typ == "box-shadow" || typ == "boxshadow" || typ == "drop-shadow" || typ == "dropshadow" || typ == "effect" ||
		strings.Contains(name, "shadow") {
		return categoryShadow
	}

	if typ == "spacing" || typ == "space" || strings.Contains(name, "spacing") || strings.HasPrefix(name, "space/") || strings.HasPrefix(name, "space-") {
		return categorySpacing
	}

	if typ == "font" || typ == "font-family" || typ == "fontfamily" || typ == "typography" ||
		strings.Contains(name, "font") || strings.Contains(name, "typography") {
		return categoryFont
	}

	if typ == "color" || strings.Contains(name, "color") {
		return categoryColor
	}

	if s, ok := token.Value.(string); ok {
		s = strings.TrimSpace(s)
		if strings.HasPrefix(s, "#") || strings.HasPrefix(s, "rgb(") || strings.HasPrefix(s, "rgba(") || strings.HasPrefix(s, "hsl(") || strings.HasPrefix(s, "hsla(") {
			return categoryColor
		}
	}

	if m, ok := token.Value.(map[string]interface{}); ok {
		if _, isColor := formatColorMap(m); isColor {
			return categoryColor
		}
	}

	if typ != "" && typ != "float" && typ != "number" && typ != "string" && typ != "boolean" {
		return typ
	}

	return categoryCustom
}

func getCategoryNoisePrefixes(cat string) []string {
	switch cat {
	case categoryColor:
		return []string{
			"semantic colors", "semantic-colors", "semantic color", "semantic-color",
			"colors", "color", "primitives", "primitive",
		}
	case categoryRadius:
		return []string{
			"border radius", "border-radius", "corner radius", "corner-radius",
			"radii", "radius",
		}
	case categoryShadow:
		return []string{
			"box shadow", "box-shadow", "drop shadow", "drop-shadow",
			"shadows", "shadow", "effects", "effect",
		}
	case categorySpacing:
		return []string{
			"spacings", "spacing", "spaces", "space",
		}
	case categoryFont:
		return []string{
			"typography", "font family", "font-family", "fonts", "font",
		}
	default:
		return nil
	}
}

func tokenKebabName(token contracts.FigmaToken, cat string) string {
	raw := strings.TrimSpace(token.Name)
	if raw == "" {
		raw = token.Id
	}

	segments := strings.Split(raw, "/")
	if len(segments) > 1 && isStrippableTier(toKebabCase(segments[0])) {
		segments = segments[1:]
	}
	noisePrefixes := getCategoryNoisePrefixes(cat)

	for len(segments) > 1 {
		first := strings.ToLower(strings.TrimSpace(segments[0]))
		matched := false
		for _, noise := range noisePrefixes {
			if first == noise || toKebabCase(first) == toKebabCase(noise) {
				matched = true
				break
			}
		}
		if matched {
			segments = segments[1:]
		} else {
			break
		}
	}

	joined := strings.Join(segments, "/")
	kebab := toKebabCase(joined)
	if kebab == "" {
		return toKebabCase(token.Id)
	}
	return kebab
}

func tokenToCSS(token contracts.FigmaToken) (varName string, varValue string, ok bool) {
	if token.Value == nil {
		return "", "", false
	}
	if _, isAlias := getAliasID(token.Value); isAlias {
		return "", "", false
	}

	cat := detectCategory(token)
	kebab := tokenKebabName(token, cat)
	if kebab == "" {
		return "", "", false
	}

	varName = cssVarPrefix(cat) + kebab

	switch cat {
	case categoryColor:
		if s, ok := token.Value.(string); ok {
			varValue = strings.TrimSpace(s)
		} else if m, ok := token.Value.(map[string]interface{}); ok {
			if hex, okColor := formatColorMap(m); okColor {
				varValue = hex
			} else {
				varValue = fmt.Sprintf("%v", token.Value)
			}
		} else {
			varValue = fmt.Sprintf("%v", token.Value)
		}

	case categoryRadius, categorySpacing:
		if num, okNum := getNumericValue(token.Value); okNum {
			varValue = fmt.Sprintf("%gpx", num)
		} else if s, ok := token.Value.(string); ok {
			s = strings.TrimSpace(s)
			if isNumericString(s) {
				varValue = s + "px"
			} else {
				varValue = s
			}
		} else {
			varValue = fmt.Sprintf("%v", token.Value)
		}

	case categoryShadow:
		if s, ok := token.Value.(string); ok {
			varValue = strings.TrimSpace(s)
		} else if m, ok := token.Value.(map[string]interface{}); ok {
			varValue = formatShadowMap(m)
		} else {
			varValue = fmt.Sprintf("%v", token.Value)
		}

	default:
		if s, ok := token.Value.(string); ok {
			varValue = strings.TrimSpace(s)
		} else {
			varValue = fmt.Sprintf("%v", token.Value)
		}
	}

	return varName, varValue, true
}

// cssVarPrefix returns the CSS custom property prefix for a token category.
func cssVarPrefix(cat string) string {
	switch cat {
	case categoryColor:
		return "--color-"
	case categoryRadius:
		return "--radius-"
	case categoryShadow:
		return "--shadow-"
	case categorySpacing:
		return "--spacing-"
	case categoryFont:
		return "--font-"
	default:
		return "--" + kebabCaseString(cat) + "-"
	}
}

func getNumericValue(val interface{}) (float64, bool) {
	switch num := val.(type) {
	case float64:
		return num, true
	case float32:
		return float64(num), true
	case int:
		return float64(num), true
	case int64:
		return float64(num), true
	}
	return 0, false
}

func isNumericString(s string) bool {
	if s == "" {
		return false
	}
	hasDot := false
	for i, r := range s {
		if r == '-' && i == 0 {
			continue
		}
		if r == '.' && !hasDot {
			hasDot = true
			continue
		}
		if !unicode.IsDigit(r) {
			return false
		}
	}
	return true
}

func toKebabCase(s string) string {
	var sb strings.Builder
	runes := []rune(s)
	n := len(runes)

	for i := 0; i < n; i++ {
		r := runes[i]

		if r == ' ' || r == '_' || r == '/' || r == '\\' || r == '.' || r == ':' {
			if sb.Len() > 0 && !strings.HasSuffix(sb.String(), "-") {
				sb.WriteByte('-')
			}
			continue
		}

		if r == '-' {
			if sb.Len() > 0 && !strings.HasSuffix(sb.String(), "-") {
				sb.WriteByte('-')
			}
			continue
		}

		if unicode.IsUpper(r) {
			if i > 0 {
				prev := runes[i-1]
				if unicode.IsLower(prev) || unicode.IsDigit(prev) {
					if sb.Len() > 0 && !strings.HasSuffix(sb.String(), "-") {
						sb.WriteByte('-')
					}
				} else if i+1 < n && unicode.IsLower(runes[i+1]) && unicode.IsUpper(prev) {
					if sb.Len() > 0 && !strings.HasSuffix(sb.String(), "-") {
						sb.WriteByte('-')
					}
				}
			}
			sb.WriteRune(unicode.ToLower(r))
			continue
		}

		if unicode.IsLetter(r) || unicode.IsDigit(r) {
			sb.WriteRune(unicode.ToLower(r))
		}
	}

	return strings.Trim(sb.String(), "-")
}

func kebabCaseString(s string) string {
	res := toKebabCase(s)
	if res == "" {
		return "var"
	}
	return res
}

func mapCategoryToTSKey(cat string) string {
	switch cat {
	case categoryColor:
		return "colors"
	case categoryRadius:
		return "radius"
	case categorySpacing:
		return "spacing"
	case categoryShadow:
		return "shadows"
	case categoryFont:
		return "fonts"
	default:
		return "custom"
	}
}

func sanitizeTokenKey(token contracts.FigmaToken, cat string) string {
	raw := strings.TrimSpace(token.Name)
	if raw == "" {
		raw = token.Id
	}
	if raw == "" {
		return ""
	}

	segments := strings.Split(raw, "/")
	noisePrefixes := getCategoryNoisePrefixes(cat)
	if cat != "" {
		noisePrefixes = append(noisePrefixes, strings.ToLower(cat))
	}
	noisePrefixes = append(noisePrefixes, "custom")

	for len(segments) > 1 {
		first := strings.ToLower(strings.TrimSpace(segments[0]))
		matched := false
		for _, noise := range noisePrefixes {
			if first == noise || toKebabCase(first) == toKebabCase(noise) {
				matched = true
				break
			}
		}
		if matched {
			segments = segments[1:]
		} else {
			break
		}
	}

	joined := strings.Join(segments, "/")
	joined = strings.TrimSpace(joined)

	lowerJoined := strings.ToLower(joined)
	for _, noise := range noisePrefixes {
		delims := []string{" ", "-", "_"}
		trimmedOne := false
		for _, d := range delims {
			prefix := noise + d
			if strings.HasPrefix(lowerJoined, prefix) {
				rem := strings.TrimSpace(joined[len(prefix):])
				if rem != "" {
					joined = rem
					lowerJoined = strings.ToLower(joined)
					trimmedOne = true
					break
				}
			}
		}
		if trimmedOne {
			break
		}
	}

	camel := toCamelCase(joined)
	if camel == "" {
		camel = toCamelCase(token.Id)
	}
	return camel
}

func toCamelCase(s string) string {
	s = strings.TrimSpace(s)
	if s == "" {
		return ""
	}

	// Preserve leading underscores or dollar signs
	var leadingPrefix strings.Builder
	idx := 0
	for idx < len(s) && (s[idx] == '_' || s[idx] == '$') {
		leadingPrefix.WriteByte(s[idx])
		idx++
	}

	trimmed := s[idx:]
	if trimmed == "" {
		return leadingPrefix.String()
	}

	isDelim := func(r rune) bool {
		return r == ' ' || r == '-' || r == '_' || r == '/' || r == '\\' || r == '\t'
	}

	var words []string
	var current strings.Builder
	for _, r := range trimmed {
		if isDelim(r) {
			if current.Len() > 0 {
				words = append(words, current.String())
				current.Reset()
			}
		} else {
			current.WriteRune(r)
		}
	}
	if current.Len() > 0 {
		words = append(words, current.String())
	}

	if len(words) == 0 {
		return leadingPrefix.String()
	}

	var sb strings.Builder
	sb.WriteString(leadingPrefix.String())
	for i, w := range words {
		if w == "" {
			continue
		}
		runes := []rune(w)
		if i == 0 {
			allUpper := true
			hasLetter := false
			for _, r := range runes {
				if unicode.IsLetter(r) {
					hasLetter = true
					if !unicode.IsUpper(r) {
						allUpper = false
						break
					}
				}
			}
			if allUpper && hasLetter {
				for j := 0; j < len(runes); j++ {
					runes[j] = unicode.ToLower(runes[j])
				}
			} else {
				runes[0] = unicode.ToLower(runes[0])
			}
			sb.WriteString(string(runes))
		} else {
			runes[0] = unicode.ToUpper(runes[0])
			allUpper := true
			hasLetter := false
			for _, r := range runes[1:] {
				if unicode.IsLetter(r) {
					hasLetter = true
					if !unicode.IsUpper(r) {
						allUpper = false
						break
					}
				}
			}
			if allUpper && hasLetter {
				for j := 1; j < len(runes); j++ {
					runes[j] = unicode.ToLower(runes[j])
				}
			}
			sb.WriteString(string(runes))
		}
	}

	return sb.String()
}

func isValidIdentifier(s string) bool {
	if s == "" {
		return false
	}
	runes := []rune(s)
	first := runes[0]
	if !((first >= 'a' && first <= 'z') || (first >= 'A' && first <= 'Z') || first == '_' || first == '$') {
		return false
	}
	for _, r := range runes[1:] {
		if !((r >= 'a' && r <= 'z') || (r >= 'A' && r <= 'Z') || (r >= '0' && r <= '9') || r == '_' || r == '$') {
			return false
		}
	}
	return true
}

func formatTSPropertyKey(key string) string {
	if isValidIdentifier(key) {
		return key
	}
	return strconv.Quote(key)
}

func serializeTSValue(val interface{}) string {
	if val == nil {
		return "null"
	}

	switch v := val.(type) {
	case string:
		return strconv.Quote(v)
	case bool:
		if v {
			return "true"
		}
		return "false"
	case int:
		return fmt.Sprintf("%d", v)
	case int64:
		return fmt.Sprintf("%d", v)
	case int32:
		return fmt.Sprintf("%d", v)
	case uint:
		return fmt.Sprintf("%d", v)
	case uint64:
		return fmt.Sprintf("%d", v)
	case uint32:
		return fmt.Sprintf("%d", v)
	case float64:
		if math.IsNaN(v) || math.IsInf(v, 0) {
			return "0"
		}
		if v == math.Trunc(v) {
			return fmt.Sprintf("%d", int64(v))
		}
		return fmt.Sprintf("%g", v)
	case float32:
		f := float64(v)
		if math.IsNaN(f) || math.IsInf(f, 0) {
			return "0"
		}
		if f == math.Trunc(f) {
			return fmt.Sprintf("%d", int64(f))
		}
		return fmt.Sprintf("%g", f)
	case map[string]interface{}:
		if hex, okColor := formatColorMap(v); okColor {
			return strconv.Quote(hex)
		}
		b, err := json.MarshalIndent(v, "    ", "  ")
		if err == nil {
			return string(b)
		}
		return "{}"
	default:
		b, err := json.MarshalIndent(v, "    ", "  ")
		if err == nil {
			return string(b)
		}
		return fmt.Sprintf("%v", v)
	}
}
