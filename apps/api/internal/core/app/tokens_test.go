package app_test

import (
	"sort"
	"strings"
	"testing"

	"github.com/dwlhm/supernova/apps/api/internal/core/app"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

func TestResolveTokens_DirectValues(t *testing.T) {
	tokens := []contracts.FigmaToken{
		{
			Id:    "tok-1",
			Name:  "colors/primary",
			Type:  "color",
			Value: "#18a0fb",
		},
		{
			Id:    "tok-2",
			Name:  "radius/sm",
			Type:  "float",
			Value: float64(4),
		},
		{
			Id:   "tok-3",
			Name: "Semantic Colors/Background/Primary faded",
			Type: "color",
			Value: map[string]interface{}{
				"r": 0.925490196,
				"g": 0.960784313,
				"b": 1.0,
				"a": 1.0,
			},
		},
	}

	resolved := app.ResolveTokens(tokens)
	if len(resolved) != 3 {
		t.Fatalf("expected 3 resolved tokens, got %d", len(resolved))
	}

	if resolved[0].Value != "#18a0fb" {
		t.Errorf("expected #18a0fb, got %v", resolved[0].Value)
	}
	if resolved[1].Value != float64(4) {
		t.Errorf("expected 4, got %v", resolved[1].Value)
	}
	if resolved[2].Value != "#ecf5ff" {
		t.Errorf("expected #ecf5ff for converted color, got %v", resolved[2].Value)
	}
}

func TestResolveTokens_Aliases(t *testing.T) {
	tokens := []contracts.FigmaToken{
		{
			Id:   "base-color",
			Name: "Primitives/Blue/500",
			Type: "color",
			Value: map[string]interface{}{
				"r": 0.925490196,
				"g": 0.960784313,
				"b": 1.0,
			},
		},
		{
			Id:   "semantic-bg",
			Name: "Semantic Colors/Background/Primary faded",
			Type: "color",
			Value: map[string]interface{}{
				"type": "VARIABLE_ALIAS",
				"id":   "VariableID:base-color",
			},
		},
		{
			Id:   "component-bg",
			Name: "Button/Background/Default",
			Type: "color",
			Value: map[string]interface{}{
				"type": "VARIABLE_ALIAS",
				"id":   "semantic-bg",
			},
		},
	}

	resolved := app.ResolveTokens(tokens)
	if len(resolved) != 3 {
		t.Fatalf("expected 3 resolved tokens, got %d", len(resolved))
	}

	// Base color resolved from float map to hex
	if resolved[0].Value != "#ecf5ff" {
		t.Errorf("expected #ecf5ff, got %v", resolved[0].Value)
	}
	// Direct alias resolved to #ecf5ff
	if resolved[1].Value != "#ecf5ff" {
		t.Errorf("expected #ecf5ff for direct alias, got %v", resolved[1].Value)
	}
	// Chained alias resolved to #ecf5ff
	if resolved[2].Value != "#ecf5ff" {
		t.Errorf("expected #ecf5ff for chained alias, got %v", resolved[2].Value)
	}
}

func TestResolveTokens_CycleDetection(t *testing.T) {
	// A -> B -> A cycle
	tokens := []contracts.FigmaToken{
		{
			Id:   "tok-a",
			Name: "Token A",
			Type: "color",
			Value: map[string]interface{}{
				"type": "VARIABLE_ALIAS",
				"id":   "tok-b",
			},
		},
		{
			Id:   "tok-b",
			Name: "Token B",
			Type: "color",
			Value: map[string]interface{}{
				"type": "VARIABLE_ALIAS",
				"id":   "tok-a",
			},
		},
		{
			Id:   "tok-self",
			Name: "Token Self",
			Type: "color",
			Value: map[string]interface{}{
				"type": "VARIABLE_ALIAS",
				"id":   "tok-self",
			},
		},
	}

	// Must not hang or crash
	resolved := app.ResolveTokens(tokens)
	if len(resolved) != 3 {
		t.Fatalf("expected 3 tokens returned, got %d", len(resolved))
	}
}

func TestResolveTokens_ColorConversion(t *testing.T) {
	tests := []struct {
		name     string
		input    map[string]interface{}
		expected string
	}{
		{
			name: "Solid hex rgb (background primary faded)",
			input: map[string]interface{}{
				"r": 0.925490196,
				"g": 0.960784313,
				"b": 1.0,
				"a": 1.0,
			},
			expected: "#ecf5ff",
		},
		{
			name: "Pure black",
			input: map[string]interface{}{
				"r": 0.0,
				"g": 0.0,
				"b": 0.0,
			},
			expected: "#000000",
		},
		{
			name: "Color with opacity < 1",
			input: map[string]interface{}{
				"r": 1.0,
				"g": 0.0,
				"b": 0.0,
				"a": 0.5,
			},
			expected: "#ff000080",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tokens := []contracts.FigmaToken{
				{
					Id:    "c1",
					Name:  "test-color",
					Type:  "color",
					Value: tt.input,
				},
			}
			res := app.ResolveTokens(tokens)
			if res[0].Value != tt.expected {
				t.Errorf("expected %s, got %v", tt.expected, res[0].Value)
			}
		})
	}
}

func TestGenerateThemeCSS(t *testing.T) {
	tokens := []contracts.FigmaToken{
		{
			Id:   "color-1",
			Name: "Semantic Colors/Background/Primary faded",
			Type: "color",
			Value: map[string]interface{}{
				"r": 0.925490196,
				"g": 0.960784313,
				"b": 1.0,
			},
		},
		{
			Id:    "radius-1",
			Name:  "Radius/sm",
			Type:  "float",
			Value: float64(4),
		},
		{
			Id:    "shadow-1",
			Name:  "Shadow/md",
			Type:  "string",
			Value: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
		},
	}

	css := app.GenerateThemeCSS(tokens)

	expectedLines := []string{
		"@theme {",
		"  --color-background-primary-faded: #ecf5ff;",
		"  --radius-sm: 4px;",
		"  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);",
		"}",
	}

	for _, line := range expectedLines {
		if !strings.Contains(css, line) {
			t.Errorf("GenerateThemeCSS missing line: %q\nFull output:\n%s", line, css)
		}
	}
}

func TestGenerateTokensCSS(t *testing.T) {
	tokens := []contracts.FigmaToken{
		{
			Id:    "color-1",
			Name:  "Semantic Colors/Background/Primary faded",
			Type:  "color",
			Value: "#ecf5ff",
		},
		{
			Id:    "radius-1",
			Name:  "Radius/sm",
			Type:  "radius",
			Value: "4px",
		},
	}

	css := app.GenerateTokensCSS(tokens)

	if !strings.HasPrefix(css, ":root {\n") {
		t.Errorf("expected :root {\n prefix, got:\n%s", css)
	}
	if !strings.Contains(css, "--color-background-primary-faded: #ecf5ff;") {
		t.Errorf("missing --color-background-primary-faded in tokens CSS:\n%s", css)
	}
	if !strings.Contains(css, "--radius-sm: 4px;") {
		t.Errorf("missing --radius-sm in tokens CSS:\n%s", css)
	}
}

func TestExtractTailwindUtilityClasses(t *testing.T) {
	tokens := []contracts.FigmaToken{
		{
			Id:    "t1",
			Name:  "Semantic Colors/Background/Primary faded",
			Type:  "color",
			Value: "#ecf5ff",
		},
		{
			Id:    "t2",
			Name:  "Semantic Colors/Foreground/Primary",
			Type:  "color",
			Value: "#111827",
		},
		{
			Id:    "t3",
			Name:  "Semantic Colors/Border/Neutral",
			Type:  "color",
			Value: "#e5e7eb",
		},
		{
			Id:    "t4",
			Name:  "Radius/sm",
			Type:  "float",
			Value: 4,
		},
		{
			Id:    "t5",
			Name:  "Shadow/md",
			Type:  "string",
			Value: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
		},
	}

	classes := app.ExtractTailwindUtilityClasses(tokens)

	expected := []string{
		"bg-background-primary-faded",
		"border-border-neutral",
		"rounded-sm",
		"shadow-md",
		"text-foreground-primary",
	}

	for _, exp := range expected {
		found := false
		for _, c := range classes {
			if c == exp {
				found = true
				break
			}
		}
		if !found {
			t.Errorf("expected class %q not found in %v", exp, classes)
		}
	}
}

func TestGenerateThemeCSS_TierNaming(t *testing.T) {
	tests := []struct {
		name    string
		token   contracts.FigmaToken
		wantVar string
	}{
		{
			name:    "semantic tier stripped",
			token:   contracts.FigmaToken{Id: "s1", Name: "🌱 Semantic/colors/background/default", Type: "color", Value: "#ffffff"},
			wantVar: "--color-background-default: #ffffff;",
		},
		{
			name:    "semantic focus ring",
			token:   contracts.FigmaToken{Id: "s2", Name: "🌱 Semantic/colors/focus/ring-primary", Type: "color", Value: "#2563eb"},
			wantVar: "--color-focus-ring-primary: #2563eb;",
		},
		{
			name:    "primitive tier stripped",
			token:   contracts.FigmaToken{Id: "p1", Name: "🌍 Primitive/colors/neutral/100", Type: "color", Value: "#f5f5f5"},
			wantVar: "--color-neutral-100: #f5f5f5;",
		},
		{
			name:    "components tier keeps prefix",
			token:   contracts.FigmaToken{Id: "c1", Name: "🧩 Components/button/destructive/color/container/background/default", Type: "color", Value: "#dc2626"},
			wantVar: "--color-components-button-destructive-color-container-background-default: #dc2626;",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			css := app.GenerateThemeCSS([]contracts.FigmaToken{tt.token})
			if !strings.Contains(css, tt.wantVar) {
				t.Errorf("expected %q in theme CSS:\n%s", tt.wantVar, css)
			}
		})
	}
}

func TestGenerateCSS_SemanticWinsCollision(t *testing.T) {
	primitive := contracts.FigmaToken{Id: "p", Name: "🌍 Primitive/colors/brand/komads/primary", Type: "color", Value: "#000001"}
	semantic := contracts.FigmaToken{Id: "s", Name: "🌱 Semantic/colors/brand/komads/primary", Type: "color", Value: "#000002"}
	const want = "--color-brand-komads-primary: #000002;"

	generators := map[string]func([]contracts.FigmaToken) string{
		"theme":  app.GenerateThemeCSS,
		"tokens": app.GenerateTokensCSS,
	}
	orders := map[string][]contracts.FigmaToken{
		"primitive first": {primitive, semantic},
		"semantic first":  {semantic, primitive},
	}

	for genName, gen := range generators {
		for orderName, toks := range orders {
			t.Run(genName+"/"+orderName, func(t *testing.T) {
				css := gen(toks)
				if !strings.Contains(css, want) {
					t.Errorf("expected semantic value %q, got:\n%s", want, css)
				}
			})
		}
	}
}

func tierCatalogTokens() []contracts.FigmaToken {
	return []contracts.FigmaToken{
		{Id: "p1", Name: "🌍 Primitive/colors/neutral/100", Type: "color", Value: "#f5f5f5"},
		{Id: "s1", Name: "🌱 Semantic/colors/background/default", Type: "color", Value: "#ffffff"},
		{Id: "s2", Name: "🌱 Semantic/colors/foreground/default", Type: "color", Value: "#111111"},
		{Id: "s3", Name: "🌱 Semantic/colors/focus/ring-primary", Type: "color", Value: "#2563eb"},
		{Id: "s4", Name: "🌱 Semantic/colors/chart/series-1", Type: "color", Value: "#22c55e"},
		{Id: "s5", Name: "🌱 Semantic/colors/border/default", Type: "color", Value: "#e5e7eb"},
		{Id: "s6", Name: "🌱 Semantic/colors/primary/default", Type: "color", Value: "#1d4ed8"},
		{Id: "s7", Name: "🌱 Semantic/colors/alias", Type: "color", Value: map[string]interface{}{"type": "VARIABLE_ALIAS", "id": "missing"}},
		{Id: "c1", Name: "🧩 Components/button/destructive/color/container/background/default", Type: "color", Value: "#dc2626"},
		{Id: "r1", Name: "Radius/sm", Type: "float", Value: 4},
		{Id: "sh1", Name: "Shadow/md", Type: "string", Value: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"},
		{Id: "sp1", Name: "Spacing/4", Type: "float", Value: 16},
	}
}

func TestExtractTailwindUtilityClasses_RoleAware(t *testing.T) {
	classes := app.ExtractTailwindUtilityClasses(tierCatalogTokens())
	set := make(map[string]bool, len(classes))
	for _, c := range classes {
		set[c] = true
	}

	tests := []struct {
		class string
		want  bool
	}{
		{"bg-background-default", true},
		{"text-background-default", false},
		{"text-foreground-default", true},
		{"fill-foreground-default", true},
		{"stroke-foreground-default", true},
		{"placeholder-foreground-default", true},
		{"bg-foreground-default", false},
		{"border-border-default", true},
		{"divide-border-default", true},
		{"outline-border-default", true},
		{"ring-focus-ring-primary", true},
		{"outline-focus-ring-primary", true},
		{"bg-focus-ring-primary", false},
		{"fill-chart-series-1", true},
		{"bg-chart-series-1", true},
		{"ring-chart-series-1", false},
		{"bg-primary-default", true},
		{"ring-primary-default", true},
		{"bg-components-button-destructive-color-container-background-default", true},
		{"ring-components-button-destructive-color-container-background-default", false},
		{"rounded-sm", true},
		{"shadow-md", true},
		{"p-4", true},
		{"px-4", true},
		{"py-4", true},
		{"m-4", true},
		{"gap-4", true},
		{"bg-neutral-100", false},
		{"text-neutral-100", false},
		{"bg-alias", false},
	}

	for _, tt := range tests {
		t.Run(tt.class, func(t *testing.T) {
			if set[tt.class] != tt.want {
				t.Errorf("class %q present=%v, want %v (catalog: %v)", tt.class, set[tt.class], tt.want, classes)
			}
		})
	}

	for _, c := range classes {
		if strings.Contains(c, "neutral-100") {
			t.Errorf("primitive token leaked into catalog: %q", c)
		}
	}
	if !sort.StringsAreSorted(classes) {
		t.Errorf("catalog not sorted: %v", classes)
	}
}

func TestExtractTailwindUtilityClasses_ParityWithThemeCSS(t *testing.T) {
	tokens := tierCatalogTokens()
	css := app.GenerateThemeCSS(tokens)
	classes := app.ExtractTailwindUtilityClasses(tokens)
	if len(classes) == 0 {
		t.Fatal("expected non-empty catalog")
	}

	varPrefixByUtility := map[string]string{
		"bg": "--color-", "text": "--color-", "border": "--color-", "ring": "--color-",
		"fill": "--color-", "stroke": "--color-", "outline": "--color-", "divide": "--color-",
		"placeholder": "--color-",
		"rounded":     "--radius-",
		"shadow":      "--shadow-",
		"p":           "--spacing-", "px": "--spacing-", "py": "--spacing-", "m": "--spacing-", "gap": "--spacing-",
	}

	for _, c := range classes {
		parts := strings.SplitN(c, "-", 2)
		if len(parts) != 2 {
			t.Errorf("malformed class %q", c)
			continue
		}
		prefix, ok := varPrefixByUtility[parts[0]]
		if !ok {
			t.Errorf("unknown utility in class %q", c)
			continue
		}
		if varDecl := "  " + prefix + parts[1] + ":"; !strings.Contains(css, varDecl) {
			t.Errorf("class %q has no matching var %q in theme CSS:\n%s", c, strings.TrimSpace(varDecl), css)
		}
	}
}

func TestGenerateTokensTS_EmptyAndNil(t *testing.T) {
	expectedEmpty := "export const tokens = {} as const;\n\nexport type Tokens = typeof tokens;\n"

	// Nil slice
	if out := app.GenerateTokensTS(nil); out != expectedEmpty {
		t.Errorf("expected empty tokens output for nil slice, got:\n%s", out)
	}

	// Empty slice
	if out := app.GenerateTokensTS([]contracts.FigmaToken{}); out != expectedEmpty {
		t.Errorf("expected empty tokens output for empty slice, got:\n%s", out)
	}

	// Slice with only empty names and IDs
	tokens := []contracts.FigmaToken{
		{Name: "", Id: ""},
		{Name: "   ", Id: ""},
	}
	if out := app.GenerateTokensTS(tokens); out != expectedEmpty {
		t.Errorf("expected empty tokens output for invalid entries, got:\n%s", out)
	}
}

func TestGenerateTokensTS_BasicTokens(t *testing.T) {
	tokens := []contracts.FigmaToken{
		{
			Id:    "c1",
			Name:  "color/background-primary",
			Type:  "color",
			Value: "#014ee1",
		},
		{
			Id:   "c2",
			Name: "Semantic Colors/Foreground/Primary",
			Type: "color",
			Value: map[string]interface{}{
				"r": 0.0,
				"g": 0.0,
				"b": 0.0,
			},
		},
		{
			Id:    "r1",
			Name:  "Radius/sm",
			Type:  "radius",
			Value: float64(4),
		},
		{
			Id:    "r2",
			Name:  "border-radius/md",
			Type:  "radius",
			Value: float64(8),
		},
		{
			Id:    "s1",
			Name:  "spacing/space 4",
			Type:  "spacing",
			Value: "16px",
		},
		{
			Id:    "sh1",
			Name:  "Shadow/md",
			Type:  "shadow",
			Value: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
		},
		{
			Id:    "f1",
			Name:  "typography/body",
			Type:  "font",
			Value: "Inter, sans-serif",
		},
		{
			Id:    "cust1",
			Name:  "custom/opacity-subtle",
			Type:  "custom",
			Value: 0.5,
		},
		{
			Id:    "cust2",
			Name:  "custom/z-index-modal",
			Type:  "custom",
			Value: float64(1000),
		},
	}

	ts := app.GenerateTokensTS(tokens)

	expectedSnippet := `export const tokens = {
  colors: {
    backgroundPrimary: "#014ee1",
    foregroundPrimary: "#000000",
  },
  custom: {
    opacitySubtle: 0.5,
    zIndexModal: 1000,
  },
  fonts: {
    body: "Inter, sans-serif",
  },
  radius: {
    md: 8,
    sm: 4,
  },
  shadows: {
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
  spacing: {
    "4": "16px",
  },
} as const;

export type Tokens = typeof tokens;
`

	if ts != expectedSnippet {
		t.Errorf("GenerateTokensTS output mismatch.\nExpected:\n%s\nGot:\n%s", expectedSnippet, ts)
	}
}

func TestGenerateTokensTS_IdentifierSanitizationAndInvalidChars(t *testing.T) {
	tokens := []contracts.FigmaToken{
		{
			Id:    "1",
			Name:  "color/background-primary",
			Type:  "color",
			Value: "#014ee1",
		},
		{
			Id:    "2",
			Name:  "color/button_secondary",
			Type:  "color",
			Value: "#ffffff",
		},
		{
			Id:    "3",
			Name:  "color/ButtonTertiary",
			Type:  "color",
			Value: "#f3f4f6",
		},
		{
			Id:    "4",
			Name:  "spacing/space 4",
			Type:  "spacing",
			Value: "16px",
		},
		{
			Id:    "5",
			Name:  "radius/2xl",
			Type:  "radius",
			Value: 24,
		},
		{
			Id:    "6",
			Name:  "custom/invalid.key",
			Type:  "custom",
			Value: "with-dot",
		},
		{
			Id:    "7",
			Name:  "custom/btn@hover",
			Type:  "custom",
			Value: "#111",
		},
		{
			Id:    "8",
			Name:  "custom/100%",
			Type:  "custom",
			Value: 1,
		},
		{
			Id:    "9",
			Name:  "custom/_private",
			Type:  "custom",
			Value: "secret",
		},
		{
			Id:    "10",
			Name:  "custom/$token",
			Type:  "custom",
			Value: "dollar",
		},
	}

	ts := app.GenerateTokensTS(tokens)

	expectedSubstrings := []string{
		`backgroundPrimary: "#014ee1",`,
		`buttonSecondary: "#ffffff",`,
		`buttonTertiary: "#f3f4f6",`,
		`"4": "16px",`,
		`"2xl": 24,`,
		`"invalid.key": "with-dot",`,
		`"btn@hover": "#111",`,
		`"100%": 1,`,
		`_private: "secret",`,
		`$token: "dollar",`,
	}

	for _, sub := range expectedSubstrings {
		if !strings.Contains(ts, sub) {
			t.Errorf("GenerateTokensTS missing expected identifier snippet: %s\nFull output:\n%s", sub, ts)
		}
	}
}

func TestGenerateTokensTS_CycleAliases(t *testing.T) {
	// A -> B -> A cycle plus resolved C
	tokens := []contracts.FigmaToken{
		{
			Id:   "tok-a",
			Name: "colors/token-a",
			Type: "color",
			Value: map[string]interface{}{
				"type": "VARIABLE_ALIAS",
				"id":   "tok-b",
			},
		},
		{
			Id:   "tok-b",
			Name: "colors/token-b",
			Type: "color",
			Value: map[string]interface{}{
				"type": "VARIABLE_ALIAS",
				"id":   "tok-a",
			},
		},
		{
			Id:   "tok-base",
			Name: "primitives/blue-500",
			Type: "color",
			Value: map[string]interface{}{
				"r": 0.0,
				"g": 0.5,
				"b": 1.0,
			},
		},
		{
			Id:   "tok-alias",
			Name: "colors/primary",
			Type: "color",
			Value: map[string]interface{}{
				"type": "VARIABLE_ALIAS",
				"id":   "tok-base",
			},
		},
	}

	// Must not hang or panic
	ts := app.GenerateTokensTS(tokens)
	if !strings.Contains(ts, "export const tokens = {") {
		t.Fatalf("expected valid tokens export, got:\n%s", ts)
	}
	// Resolved alias must produce valid hex string
	if !strings.Contains(ts, `primary: "#0080ff",`) {
		t.Errorf("expected resolved alias primary to be #0080ff, got:\n%s", ts)
	}
}

func TestGenerateTokensTS_ValueSerialization(t *testing.T) {
	tokens := []contracts.FigmaToken{
		{
			Id:    "v-str",
			Name:  "custom/str-val",
			Type:  "custom",
			Value: "hello world",
		},
		{
			Id:    "v-int",
			Name:  "custom/int-val",
			Type:  "custom",
			Value: float64(16),
		},
		{
			Id:    "v-dec",
			Name:  "custom/dec-val",
			Type:  "custom",
			Value: float64(16.5),
		},
		{
			Id:    "v-bool",
			Name:  "custom/bool-val",
			Type:  "custom",
			Value: true,
		},
		{
			Id:    "v-nil",
			Name:  "custom/nil-val",
			Type:  "custom",
			Value: nil,
		},
		{
			Id:   "v-map",
			Name: "custom/map-val",
			Type: "custom",
			Value: map[string]interface{}{
				"family": "Inter",
				"weight": 600,
			},
		},
	}

	ts := app.GenerateTokensTS(tokens)

	expectedSnippets := []string{
		`strVal: "hello world",`,
		`intVal: 16,`,
		`decVal: 16.5,`,
		`boolVal: true,`,
		`nilVal: null,`,
		`mapVal: {`,
		`"family": "Inter"`,
		`"weight": 600`,
	}

	for _, snip := range expectedSnippets {
		if !strings.Contains(ts, snip) {
			t.Errorf("missing expected snippet %q in TS output:\n%s", snip, ts)
		}
	}
}

func TestGenerateTokensTS_OmitEmptyCategories(t *testing.T) {
	// Only color tokens
	tokens := []contracts.FigmaToken{
		{
			Id:    "c1",
			Name:  "color/primary",
			Type:  "color",
			Value: "#3b82f6",
		},
	}

	ts := app.GenerateTokensTS(tokens)

	if !strings.Contains(ts, "colors: {") {
		t.Errorf("expected colors category in output, got:\n%s", ts)
	}
	if strings.Contains(ts, "radius:") || strings.Contains(ts, "spacing:") || strings.Contains(ts, "shadows:") || strings.Contains(ts, "fonts:") || strings.Contains(ts, "custom:") {
		t.Errorf("expected empty categories to be omitted, got:\n%s", ts)
	}
}
