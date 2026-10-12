package app_test

import (
	"strings"
	"testing"

	"github.com/dwlhm/supernova/apps/api/internal/core/app"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

func TestGenerateTokensDoc_Empty(t *testing.T) {
	doc := app.GenerateTokensDoc(nil)
	if !strings.Contains(doc, "No design tokens found in the Figma document.") {
		t.Errorf("expected empty tokens message, got:\n%s", doc)
	}

	docEmpty := app.GenerateTokensDoc([]contracts.FigmaToken{})
	if !strings.Contains(docEmpty, "No design tokens found in the Figma document.") {
		t.Errorf("expected empty tokens message for empty slice, got:\n%s", docEmpty)
	}
}

func TestGenerateTokensDoc_AllCategories(t *testing.T) {
	colorDesc := "Primary brand color"
	spacingDesc := "Base layout spacing"
	radiusDesc := "Standard button border radius"
	shadowDesc := "Subtle card drop shadow"
	fontDesc := "Heading typography style"
	customDesc := "Custom timing curve"
	emptyDesc := "   "

	tokens := []contracts.FigmaToken{
		{
			Id:          "tok-color-1",
			Name:        "color/primary",
			Type:        "color",
			Value:       "#3b82f6",
			Description: &colorDesc,
		},
		{
			Id:          "tok-color-2",
			Name:        "color/surface",
			Type:        "color",
			Value:       map[string]interface{}{"r": 1.0, "g": 1.0, "b": 1.0, "a": 1.0},
			Description: &emptyDesc,
		},
		{
			Id:          "tok-color-3",
			Name:        "color/muted",
			Type:        "color",
			Value:       "#64748b",
			Description: nil,
		},
		{
			Id:          "tok-color-4",
			Name:        "color/nil-val",
			Type:        "color",
			Value:       nil,
			Description: nil,
		},
		{
			Id:          "tok-color-5",
			Name:        "color/alias-val",
			Type:        "color",
			Value:       map[string]interface{}{"type": "VARIABLE_ALIAS", "id": "VariableID:missing-alias"},
			Description: nil,
		},
		{
			Id:          "tok-font-1",
			Name:        "font/heading",
			Type:        "font",
			Value:       "Inter",
			Description: &fontDesc,
		},
		{
			Id:          "tok-font-2",
			Name:        "typography/body",
			Type:        "font",
			Value:       "Roboto",
			Description: nil,
		},
		{
			Id:          "tok-space-1",
			Name:        "spacing/sm",
			Type:        "spacing",
			Value:       8.0,
			Description: &spacingDesc,
		},
		{
			Id:          "tok-space-2",
			Name:        "spacing/md",
			Type:        "spacing",
			Value:       "16",
			Description: nil,
		},
		{
			Id:          "tok-radius-1",
			Name:        "radius/md",
			Type:        "radius",
			Value:       6.0,
			Description: &radiusDesc,
		},
		{
			Id:          "tok-radius-2",
			Name:        "radius/lg",
			Type:        "radius",
			Value:       12.0,
			Description: nil,
		},
		{
			Id:          "tok-shadow-1",
			Name:        "shadow/sm",
			Type:        "shadow",
			Value:       map[string]interface{}{"x": 0.0, "y": 1.0, "radius": 2.0, "spread": 0.0, "color": "#00000010"},
			Description: &shadowDesc,
		},
		{
			Id:          "tok-shadow-2",
			Name:        "shadow/md",
			Type:        "shadow",
			Value:       "0 4px 6px -1px rgba(0,0,0,0.1)",
			Description: nil,
		},
		{
			Id:          "tok-custom-1",
			Name:        "timing/ease-in-out",
			Type:        "custom",
			Value:       "cubic-bezier(0.4, 0, 0.2, 1)",
			Description: &customDesc,
		},
		{
			Id:          "tok-custom-2",
			Name:        "opacity/overlay",
			Type:        "custom",
			Value:       0.8,
			Description: nil,
		},
	}

	doc := app.GenerateTokensDoc(tokens)

	// Check headers
	headers := []string{
		"# Design Tokens",
		"## Colors",
		"## Typography Scale",
		"## Spacing Scale",
		"## Border Radius",
		"## Elevation & Shadows",
		"## Other Tokens",
		"## CSS Variables",
	}
	for _, h := range headers {
		if !strings.Contains(doc, h) {
			t.Errorf("missing header %q in generated doc:\n%s", h, doc)
		}
	}

	// Check Color swatch
	if !strings.Contains(doc, "background-color:#3b82f6") {
		t.Errorf("expected color swatch preview for #3b82f6")
	}

	// Check CSS variables block
	if !strings.Contains(doc, "```css") || !strings.Contains(doc, ":root {") {
		t.Errorf("expected CSS variables :root block")
	}
}

func TestGenerateTokensDoc_MissingCategories(t *testing.T) {
	// Only color tokens provided; other categories should show "No ... tokens defined."
	tokens := []contracts.FigmaToken{
		{
			Id:    "tok-col",
			Name:  "color/brand",
			Type:  "color",
			Value: "#10b981",
		},
	}

	doc := app.GenerateTokensDoc(tokens)

	missingNotices := []string{
		"No typography tokens defined.",
		"No spacing tokens defined.",
		"No border radius tokens defined.",
		"No elevation/shadow tokens defined.",
	}
	for _, notice := range missingNotices {
		if !strings.Contains(doc, notice) {
			t.Errorf("expected missing notice %q in doc:\n%s", notice, doc)
		}
	}

	// Now pass ONLY spacing tokens to test "No color tokens defined."
	spacingOnly := []contracts.FigmaToken{
		{
			Id:    "tok-space",
			Name:  "spacing/xl",
			Type:  "spacing",
			Value: 32.0,
		},
	}
	docSpacing := app.GenerateTokensDoc(spacingOnly)
	if !strings.Contains(docSpacing, "No color tokens defined.") {
		t.Errorf("expected 'No color tokens defined.' when only spacing tokens provided")
	}
}

func TestGenerateComponentDoc_EmptyAndDefaults(t *testing.T) {
	comp := contracts.FigmaComponentSpec{
		Id:   "comp-empty",
		Name: "",
	}

	doc := app.GenerateComponentDoc(comp)

	if !strings.Contains(doc, "# Component") {
		t.Errorf("expected default fallback title '# Component', got:\n%s", doc)
	}
	if !strings.Contains(doc, "The `Component` component extracted from Figma design specifications.") {
		t.Errorf("expected default description")
	}
	if !strings.Contains(doc, "This component has no configurable variant properties.") {
		t.Errorf("expected no configurable properties notice")
	}
	if !strings.Contains(doc, "::: code-group") {
		t.Errorf("expected VitePress ::: code-group tabs")
	}
	if !strings.Contains(doc, "```tsx [React]") ||
		!strings.Contains(doc, "```vue [Vue 3]") ||
		!strings.Contains(doc, "```svelte [Svelte]") ||
		!strings.Contains(doc, "```ts [Angular]") {
		t.Errorf("expected code group tabs for React, Vue 3, Svelte, and Angular")
	}
}

func TestGenerateComponentDoc_WithProperties(t *testing.T) {
	desc := "A customizable button component supporting multiple visual variants."
	sizeDesc := "Physical size of the button"
	disabledDesc := "Whether button interaction is disabled"

	rawProps := map[string]interface{}{
		"Variant#101": map[string]interface{}{
			"type":           "VARIANT",
			"variantOptions": []interface{}{"primary", "secondary", "destructive"},
			"defaultValue":   "primary",
			"description":    "Visual appearance style",
		},
		"Size": map[string]interface{}{
			"type":           "VARIANT",
			"variantOptions": []string{"small", "medium", "large"},
			"defaultValue":   "medium",
			"description":    sizeDesc,
		},
		"Disabled": map[string]interface{}{
			"type":         "BOOLEAN",
			"defaultValue": false,
			"description":  disabledDesc,
		},
		"FullWidth":   true,
		"Elevation":   2.5,
		"CustomNum":   42,
		"CustomStr":   "custom",
		"EmptyKey":    map[string]interface{}{"type": ""},
		"Unknown":     struct{ Foo string }{Foo: "bar"},
		"#only-hash":  "hashed",
		"NoDefault":   map[string]interface{}{"type": "string"},
		"EmptyString": "",
	}

	comp := contracts.FigmaComponentSpec{
		Id:          "btn-spec",
		Name:        "ButtonPrimary",
		Description: &desc,
		Properties:  &rawProps,
	}

	doc := app.GenerateComponentDoc(comp)

	if !strings.Contains(doc, "# ButtonPrimary") {
		t.Errorf("expected title '# ButtonPrimary'")
	}
	if !strings.Contains(doc, desc) {
		t.Errorf("expected description %q in doc", desc)
	}

	// Verify Props table
	if !strings.Contains(doc, "| Property | Type | Default | Description |") {
		t.Errorf("expected props table header")
	}
	if !strings.Contains(doc, "`Variant`") || !strings.Contains(doc, "`primary` \\| `secondary` \\| `destructive`") {
		t.Errorf("expected Variant property row with escaped pipes")
	}
	if !strings.Contains(doc, "`Size`") || !strings.Contains(doc, "`small` \\| `medium` \\| `large`") {
		t.Errorf("expected Size property row")
	}
	if !strings.Contains(doc, "`Disabled`") || !strings.Contains(doc, "boolean") {
		t.Errorf("expected Disabled boolean property row")
	}

	// Verify multi-framework code-group code
	if !strings.Contains(doc, "import ButtonPrimary from './ButtonPrimary';") {
		t.Errorf("expected React default import for ButtonPrimary")
	}
	if !strings.Contains(doc, "import ButtonPrimary from './ButtonPrimary.vue';") {
		t.Errorf("expected Vue 3 default import for ButtonPrimary")
	}
	if !strings.Contains(doc, "## Preview") {
		t.Errorf("expected ## Preview section")
	}
	if !strings.Contains(doc, `<FrameworkPreview name="ButtonPrimary" />`) {
		t.Errorf("expected <FrameworkPreview name=\"ButtonPrimary\" /> tag")
	}
	if !strings.Contains(doc, "import { ButtonPrimaryComponent } from './button-primary.component';") {
		t.Errorf("expected Angular import for ButtonPrimaryComponent")
	}
	if !strings.Contains(doc, "selector: 'app-root'") {
		t.Errorf("expected Angular selector")
	}
}

func TestGenerateComponentDoc_ComponentTypesA11y(t *testing.T) {
	// 1. Button component
	btnDoc := app.GenerateComponentDoc(contracts.FigmaComponentSpec{
		Id:   "btn",
		Name: "Button",
	})
	if !strings.Contains(btnDoc, "Native Semantics") || !strings.Contains(btnDoc, "Keyboard Activation") {
		t.Errorf("expected button a11y guidelines, got:\n%s", btnDoc)
	}

	// 2. Icon component (by name)
	iconDoc := app.GenerateComponentDoc(contracts.FigmaComponentSpec{
		Id:   "icon-1",
		Name: "IconClose",
	})
	if !strings.Contains(iconDoc, "Decorative Icons") || !strings.Contains(iconDoc, "Standalone / Meaningful Icons") {
		t.Errorf("expected icon a11y guidelines, got:\n%s", iconDoc)
	}
	if !strings.Contains(iconDoc, "<IconClose />") {
		t.Errorf("expected self-closing icon in React example, got:\n%s", iconDoc)
	}

	// 3. Icon component (by pageName)
	pageIcons := "Icons"
	iconPageDoc := app.GenerateComponentDoc(contracts.FigmaComponentSpec{
		Id:       "icon-2",
		Name:     "Search",
		PageName: &pageIcons,
	})
	if !strings.Contains(iconPageDoc, "Decorative Icons") {
		t.Errorf("expected icon a11y guidelines for component on Icons page")
	}

	// 4. Input component
	inputDoc := app.GenerateComponentDoc(contracts.FigmaComponentSpec{
		Id:   "input-1",
		Name: "InputField",
	})
	if !strings.Contains(inputDoc, "Form Label Association") || !strings.Contains(inputDoc, "Validation Errors") {
		t.Errorf("expected input a11y guidelines, got:\n%s", inputDoc)
	}

	// 5. Modal component
	modalDoc := app.GenerateComponentDoc(contracts.FigmaComponentSpec{
		Id:   "modal-1",
		Name: "ConfirmDialog",
	})
	if !strings.Contains(modalDoc, "Role & Modal Scope") || !strings.Contains(modalDoc, "Focus Trap") {
		t.Errorf("expected modal a11y guidelines, got:\n%s", modalDoc)
	}

	// 6. Generic component
	cardDoc := app.GenerateComponentDoc(contracts.FigmaComponentSpec{
		Id:   "card-1",
		Name: "CardContainer",
	})
	if !strings.Contains(cardDoc, "Keyboard Navigation") || !strings.Contains(cardDoc, "Color Contrast") {
		t.Errorf("expected generic a11y guidelines, got:\n%s", cardDoc)
	}
}

func TestGenerateComponentDoc_CodeSnippetPropsFormatting(t *testing.T) {
	// 1. Test snippet formatting when props include boolean true and boolean false
	boolTrue := true
	boolFalse := false
	props := map[string]interface{}{
		"Active":   boolTrue,
		"Disabled": boolFalse,
	}
	comp := contracts.FigmaComponentSpec{
		Id:         "nav",
		Name:       "Navbar",
		Properties: &props,
	}

	doc := app.GenerateComponentDoc(comp)
	if !strings.Contains(doc, "active") || !strings.Contains(doc, "disabled={false}") {
		t.Errorf("expected boolean attributes in snippet, got:\n%s", doc)
	}

	// 2. Test snippet formatting with string value and prop with no default
	stringProps := map[string]interface{}{
		"NoDef": map[string]interface{}{"type": "string"},
		"Theme": "dark",
	}
	themeComp := contracts.FigmaComponentSpec{
		Id:         "theme-comp",
		Name:       "ThemeBox",
		Properties: &stringProps,
	}
	themeDoc := app.GenerateComponentDoc(themeComp)
	if !strings.Contains(themeDoc, "theme=\"dark\"") || !strings.Contains(themeDoc, "noDef=\"default\"") {
		t.Errorf("expected string and default fallback attributes in snippet, got:\n%s", themeDoc)
	}

	// 3. Test with icon containing props
	iconProps := map[string]interface{}{
		"Filled": true,
	}
	iconComp := contracts.FigmaComponentSpec{
		Id:         "ic",
		Name:       "IconStar",
		Properties: &iconProps,
	}
	iconDoc := app.GenerateComponentDoc(iconComp)
	if !strings.Contains(iconDoc, "<IconStar") {
		t.Errorf("expected IconStar snippet, got:\n%s", iconDoc)
	}

	// 4. Test with empty properties map
	emptyProps := make(map[string]interface{})
	emptyComp := contracts.FigmaComponentSpec{
		Id:         "empty-p",
		Name:       "EmptyProps",
		Properties: &emptyProps,
	}
	emptyDoc := app.GenerateComponentDoc(emptyComp)
	if !strings.Contains(emptyDoc, "This component has no configurable variant properties.") {
		t.Errorf("expected no properties message for empty map")
	}
}

func TestGenerateComponentsIndexDoc_Empty(t *testing.T) {
	doc := app.GenerateComponentsIndexDoc(nil)
	if !strings.Contains(doc, "This catalog has no components available yet.") {
		t.Errorf("expected empty catalog message, got:\n%s", doc)
	}

	docEmpty := app.GenerateComponentsIndexDoc([]contracts.FigmaComponentSpec{})
	if !strings.Contains(docEmpty, "This catalog has no components available yet.") {
		t.Errorf("expected empty catalog message for empty slice, got:\n%s", docEmpty)
	}
}

func TestGenerateComponentsIndexDoc_Populated(t *testing.T) {
	btnDesc := "Interactive button element"
	cardDesc := "   " // blank string fallback
	components := []contracts.FigmaComponentSpec{
		{
			Id:          "c-1",
			Name:        "Button",
			Description: &btnDesc,
		},
		{
			Id:          "c-2",
			Name:        "Card",
			Description: &cardDesc,
		},
		{
			Id:          "c-3",
			Name:        "Button", // Duplicate to test deduplication
			Description: &btnDesc,
		},
		{
			Id:          "c-4",
			Name:        "Avatar",
			Description: nil,
		},
		{
			Id:   "c-5",
			Name: "", // Fallback to "Component"
		},
	}

	doc := app.GenerateComponentsIndexDoc(components)

	// Check table structure
	if !strings.Contains(doc, "| Component | Description | Documentation |") {
		t.Errorf("expected catalog table header")
	}

	// Check rows and links
	if !strings.Contains(doc, "| **Button** | Interactive button element | [View Button Docs](/components/button) |") {
		t.Errorf("missing or malformed Button entry in catalog:\n%s", doc)
	}
	if !strings.Contains(doc, "| **Card** | Card component | [View Card Docs](/components/card) |") {
		t.Errorf("missing or malformed Card entry in catalog:\n%s", doc)
	}
	if !strings.Contains(doc, "| **Avatar** | Avatar component | [View Avatar Docs](/components/avatar) |") {
		t.Errorf("missing or malformed Avatar entry in catalog:\n%s", doc)
	}
	if !strings.Contains(doc, "| **Component** | Component component | [View Component Docs](/components/component) |") {
		t.Errorf("missing or malformed fallback Component entry in catalog:\n%s", doc)
	}

	// Ensure Button is only listed once (deduplicated)
	count := strings.Count(doc, "[View Button Docs](/components/button)")
	if count != 1 {
		t.Errorf("expected exactly 1 Button entry, got %d", count)
	}
}

func TestGenerateComponentDoc_PreviewAndSnippets(t *testing.T) {
	desc := "A standard button component."
	props := map[string]interface{}{
		"Variant": map[string]interface{}{
			"type":         "VARIANT",
			"defaultValue": "Default",
		},
		"Size": map[string]interface{}{
			"type":         "VARIANT",
			"defaultValue": "\"Regular\"",
		},
		"Label": map[string]interface{}{
			"type":         "string",
			"defaultValue": "Submit Button",
		},
		"Disabled": map[string]interface{}{
			"type":         "BOOLEAN",
			"defaultValue": false,
		},
	}

	comp := contracts.FigmaComponentSpec{
		Id:          "btn-preview",
		Name:        "Button",
		Description: &desc,
		Properties:  &props,
	}

	doc := app.GenerateComponentDoc(comp)

	if !strings.Contains(doc, "## Preview") {
		t.Errorf("expected '## Preview' in component doc, got:\n%s", doc)
	}
	if !strings.Contains(doc, `<FrameworkPreview name="Button" />`) {
		t.Errorf("expected '<FrameworkPreview name=\"Button\" />' in component doc, got:\n%s", doc)
	}
	if !strings.Contains(doc, "import Button from './Button';") {
		t.Errorf("expected React default import 'import Button from \\'./Button\\';', got:\n%s", doc)
	}
	if !strings.Contains(doc, "import Button from './Button.vue';") {
		t.Errorf("expected Vue 3 default import 'import Button from \\'./Button.vue\\';', got:\n%s", doc)
	}
}
