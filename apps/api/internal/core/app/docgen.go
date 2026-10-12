package app

import (
	"fmt"
	"sort"
	"strings"

	"github.com/dwlhm/supernova/apps/api/internal/core/domain"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

// GenerateTokensDoc creates a comprehensive Markdown document documenting all design tokens.
// It includes Color Swatch tables, Typography Scale, Spacing Scale, Border Radius,
// Elevation/Shadows, and a complete CSS variables reference block.
func GenerateTokensDoc(tokens []contracts.FigmaToken) string {
	var sb strings.Builder
	sb.WriteString("# Design Tokens\n\n")
	sb.WriteString("Design tokens extracted from the Figma document.\n\n")

	if len(tokens) == 0 {
		sb.WriteString("No design tokens found in the Figma document.\n")
		return sb.String()
	}

	resolved := ResolveTokens(tokens)

	colors := make([]contracts.FigmaToken, 0)
	typography := make([]contracts.FigmaToken, 0)
	spacing := make([]contracts.FigmaToken, 0)
	radius := make([]contracts.FigmaToken, 0)
	shadows := make([]contracts.FigmaToken, 0)
	others := make([]contracts.FigmaToken, 0)

	for _, tok := range resolved {
		cat := detectCategory(tok)
		switch cat {
		case categoryColor:
			colors = append(colors, tok)
		case categoryFont:
			typography = append(typography, tok)
		case categorySpacing:
			spacing = append(spacing, tok)
		case categoryRadius:
			radius = append(radius, tok)
		case categoryShadow:
			shadows = append(shadows, tok)
		default:
			others = append(others, tok)
		}
	}

	sortTokens := func(toks []contracts.FigmaToken) {
		sort.Slice(toks, func(i, j int) bool {
			return toks[i].Name < toks[j].Name
		})
	}
	sortTokens(colors)
	sortTokens(typography)
	sortTokens(spacing)
	sortTokens(radius)
	sortTokens(shadows)
	sortTokens(others)

	// 1. Color Tokens Table
	sb.WriteString("## Colors\n\n")
	if len(colors) > 0 {
		sb.WriteString("| Preview | Token Name | Value | Description |\n")
		sb.WriteString("| :---: | :--- | :--- | :--- |\n")
		for _, tok := range colors {
			valStr := formatDocTokenValue(tok)
			desc := formatDocTokenDescription(tok)
			preview := fmt.Sprintf(`<span style="display:inline-block;width:1.25rem;height:1.25rem;background-color:%s;border-radius:0.25rem;border:1px solid rgba(128,128,128,0.2);vertical-align:middle;"></span>`, valStr)
			sb.WriteString(fmt.Sprintf("| %s | `%s` | `%s` | %s |\n", preview, tok.Name, valStr, desc))
		}
		sb.WriteString("\n")
	} else {
		sb.WriteString("No color tokens defined.\n\n")
	}

	// 2. Typography Scale
	sb.WriteString("## Typography Scale\n\n")
	if len(typography) > 0 {
		sb.WriteString("| Token Name | Value | Description |\n")
		sb.WriteString("| :--- | :--- | :--- |\n")
		for _, tok := range typography {
			valStr := formatDocTokenValue(tok)
			desc := formatDocTokenDescription(tok)
			sb.WriteString(fmt.Sprintf("| `%s` | `%s` | %s |\n", tok.Name, valStr, desc))
		}
		sb.WriteString("\n")
	} else {
		sb.WriteString("No typography tokens defined.\n\n")
	}

	// 3. Spacing Scale
	sb.WriteString("## Spacing Scale\n\n")
	if len(spacing) > 0 {
		sb.WriteString("| Token Name | Value | Description |\n")
		sb.WriteString("| :--- | :--- | :--- |\n")
		for _, tok := range spacing {
			valStr := formatDocTokenValue(tok)
			desc := formatDocTokenDescription(tok)
			sb.WriteString(fmt.Sprintf("| `%s` | `%s` | %s |\n", tok.Name, valStr, desc))
		}
		sb.WriteString("\n")
	} else {
		sb.WriteString("No spacing tokens defined.\n\n")
	}

	// 4. Border Radius
	sb.WriteString("## Border Radius\n\n")
	if len(radius) > 0 {
		sb.WriteString("| Token Name | Value | Description |\n")
		sb.WriteString("| :--- | :--- | :--- |\n")
		for _, tok := range radius {
			valStr := formatDocTokenValue(tok)
			desc := formatDocTokenDescription(tok)
			sb.WriteString(fmt.Sprintf("| `%s` | `%s` | %s |\n", tok.Name, valStr, desc))
		}
		sb.WriteString("\n")
	} else {
		sb.WriteString("No border radius tokens defined.\n\n")
	}

	// 5. Elevation / Shadows
	sb.WriteString("## Elevation & Shadows\n\n")
	if len(shadows) > 0 {
		sb.WriteString("| Token Name | Value | Description |\n")
		sb.WriteString("| :--- | :--- | :--- |\n")
		for _, tok := range shadows {
			valStr := formatDocTokenValue(tok)
			desc := formatDocTokenDescription(tok)
			sb.WriteString(fmt.Sprintf("| `%s` | `%s` | %s |\n", tok.Name, valStr, desc))
		}
		sb.WriteString("\n")
	} else {
		sb.WriteString("No elevation/shadow tokens defined.\n\n")
	}

	// 6. Other Tokens
	if len(others) > 0 {
		sb.WriteString("## Other Tokens\n\n")
		sb.WriteString("| Token Name | Value | Description |\n")
		sb.WriteString("| :--- | :--- | :--- |\n")
		for _, tok := range others {
			valStr := formatDocTokenValue(tok)
			desc := formatDocTokenDescription(tok)
			sb.WriteString(fmt.Sprintf("| `%s` | `%s` | %s |\n", tok.Name, valStr, desc))
		}
		sb.WriteString("\n")
	}

	// 7. CSS Variables Reference
	sb.WriteString("## CSS Variables\n\n")
	sb.WriteString("```css\n")
	sb.WriteString(GenerateTokensCSS(resolved))
	sb.WriteString("```\n")

	return sb.String()
}

func formatDocTokenValue(tok contracts.FigmaToken) string {
	_, valStr, ok := tokenToCSS(tok)
	if ok && valStr != "" {
		return valStr
	}
	if tok.Value != nil {
		return fmt.Sprintf("%v", tok.Value)
	}
	return "-"
}

func formatDocTokenDescription(tok contracts.FigmaToken) string {
	if tok.Description != nil && strings.TrimSpace(*tok.Description) != "" {
		return strings.TrimSpace(*tok.Description)
	}
	return "-"
}

// ParsedProperty represents a normalized component property definition.
type ParsedProperty struct {
	Name         string
	Type         string
	DefaultValue string
	Description  string
}

// GenerateComponentDoc produces a complete VitePress-compatible markdown documentation
// for a single Figma component spec, including multi-framework usage code groups,
// props and variants tables, and accessibility guidelines.
func GenerateComponentDoc(comp contracts.FigmaComponentSpec) string {
	compName := domain.NormalizeComponentName(comp.Name)
	kebabName := domain.CamelToKebab(compName)

	var sb strings.Builder
	sb.WriteString(fmt.Sprintf("# %s\n\n", compName))

	if comp.Description != nil && strings.TrimSpace(*comp.Description) != "" {
		sb.WriteString(strings.TrimSpace(*comp.Description))
		sb.WriteString("\n\n")
	} else {
		sb.WriteString(fmt.Sprintf("The `%s` component extracted from Figma design specifications.\n\n", compName))
	}

	sb.WriteString("## Preview\n\n")
	sb.WriteString(fmt.Sprintf("<FrameworkPreview name=%q />\n\n", compName))

	isIcon := strings.HasPrefix(strings.ToLower(compName), "icon") ||
		strings.Contains(strings.ToLower(compName), "icon") ||
		(comp.PageName != nil && strings.EqualFold(*comp.PageName, "icons"))

	parsedProps := parseComponentProperties(comp.Properties)

	// Multi-Framework Code Examples using VitePress ::: code-group tabs
	sb.WriteString("## Usage\n\n")
	sb.WriteString("::: code-group\n\n")

	// React
	sb.WriteString("```tsx [React]\n")
	sb.WriteString(fmt.Sprintf("import %s from './%s';\n\n", compName, compName))
	sb.WriteString("export default function Example() {\n")
	sb.WriteString("  return (\n")
	sb.WriteString(indentCode(renderJSXSnippet(compName, isIcon, parsedProps), "    "))
	sb.WriteString("\n  );\n")
	sb.WriteString("}\n")
	sb.WriteString("```\n\n")

	// Vue 3
	sb.WriteString("```vue [Vue 3]\n")
	sb.WriteString("<script setup lang=\"ts\">\n")
	sb.WriteString(fmt.Sprintf("import %s from './%s.vue';\n", compName, compName))
	sb.WriteString("</script>\n\n")
	sb.WriteString("<template>\n")
	sb.WriteString(indentCode(renderVueSnippet(compName, isIcon, parsedProps), "  "))
	sb.WriteString("\n</template>\n")
	sb.WriteString("```\n\n")

	// Svelte
	sb.WriteString("```svelte [Svelte]\n")
	sb.WriteString("<script lang=\"ts\">\n")
	sb.WriteString(fmt.Sprintf("  import %s from './%s.svelte';\n", compName, compName))
	sb.WriteString("</script>\n\n")
	sb.WriteString(renderSvelteSnippet(compName, isIcon, parsedProps))
	sb.WriteString("\n```\n\n")

	// Angular
	sb.WriteString("```ts [Angular]\n")
	sb.WriteString("import { Component } from '@angular/core';\n")
	sb.WriteString(fmt.Sprintf("import { %sComponent } from './%s.component';\n\n", compName, kebabName))
	sb.WriteString("@Component({\n")
	sb.WriteString("  selector: 'app-root',\n")
	sb.WriteString("  standalone: true,\n")
	sb.WriteString(fmt.Sprintf("  imports: [%sComponent],\n", compName))
	sb.WriteString("  template: `\n")
	sb.WriteString(indentCode(renderAngularSnippet(kebabName, isIcon, parsedProps), "    "))
	sb.WriteString("\n  `,\n")
	sb.WriteString("})\n")
	sb.WriteString("export class AppComponent {}\n")
	sb.WriteString("```\n\n")

	sb.WriteString(":::\n\n")

	// Props & Variants API Table
	sb.WriteString("## Props & Variants\n\n")
	if len(parsedProps) == 0 {
		sb.WriteString("This component has no configurable variant properties.\n\n")
	} else {
		sb.WriteString("| Property | Type | Default | Description |\n")
		sb.WriteString("| :--- | :--- | :--- | :--- |\n")
		for _, prop := range parsedProps {
			sb.WriteString(fmt.Sprintf("| `%s` | `%s` | %s | %s |\n", prop.Name, prop.Type, prop.DefaultValue, prop.Description))
		}
		sb.WriteString("\n")
	}

	// Accessibility Guidelines
	sb.WriteString("## Accessibility (a11y)\n\n")
	sb.WriteString(generateA11ySection(compName, isIcon))

	return sb.String()
}

// GenerateComponentsIndexDoc creates a catalog Markdown table of all components.
func GenerateComponentsIndexDoc(components []contracts.FigmaComponentSpec) string {
	var sb strings.Builder
	sb.WriteString("# Component Catalog\n\n")
	sb.WriteString("Overview of all components extracted from the design system.\n\n")

	if len(components) == 0 {
		sb.WriteString("This catalog has no components available yet.\n")
		return sb.String()
	}

	seen := make(map[string]bool)
	type compEntry struct {
		Name        string
		Kebab       string
		Description string
	}
	var entries []compEntry

	for _, comp := range components {
		norm := domain.NormalizeComponentName(comp.Name)
		kebab := domain.CamelToKebab(norm)
		if seen[kebab] {
			continue
		}
		seen[kebab] = true

		desc := "-"
		if comp.Description != nil && strings.TrimSpace(*comp.Description) != "" {
			desc = strings.TrimSpace(*comp.Description)
		} else {
			desc = fmt.Sprintf("%s component", norm)
		}

		entries = append(entries, compEntry{
			Name:        norm,
			Kebab:       kebab,
			Description: desc,
		})
	}

	sort.Slice(entries, func(i, j int) bool {
		return entries[i].Name < entries[j].Name
	})

	sb.WriteString("| Component | Description | Documentation |\n")
	sb.WriteString("| :--- | :--- | :--- |\n")
	for _, entry := range entries {
		link := fmt.Sprintf("[View %s Docs](/components/%s)", entry.Name, entry.Kebab)
		sb.WriteString(fmt.Sprintf("| **%s** | %s | %s |\n", entry.Name, entry.Description, link))
	}

	return sb.String()
}

func parseComponentProperties(props *map[string]interface{}) []ParsedProperty {
	if props == nil || len(*props) == 0 {
		return nil
	}

	var parsed []ParsedProperty
	for rawKey, val := range *props {
		cleanKey := strings.TrimSpace(strings.Split(rawKey, "#")[0])
		if cleanKey == "" {
			cleanKey = rawKey
		}

		prop := ParsedProperty{
			Name:         cleanKey,
			Type:         "string",
			DefaultValue: "-",
			Description:  "-",
		}

		if valMap, ok := val.(map[string]interface{}); ok {
			if t, ok := valMap["type"].(string); ok && strings.TrimSpace(t) != "" {
				prop.Type = strings.ToLower(strings.TrimSpace(t))
			}
			if opts, ok := valMap["variantOptions"].([]interface{}); ok && len(opts) > 0 {
				optStrs := make([]string, len(opts))
				for i, opt := range opts {
					optStrs[i] = fmt.Sprintf("`%v`", opt)
				}
				prop.Type = strings.Join(optStrs, " \\| ")
			} else if opts, ok := valMap["variantOptions"].([]string); ok && len(opts) > 0 {
				optStrs := make([]string, len(opts))
				for i, opt := range opts {
					optStrs[i] = fmt.Sprintf("`%s`", opt)
				}
				prop.Type = strings.Join(optStrs, " \\| ")
			}
			if def, exists := valMap["defaultValue"]; exists && def != nil {
				prop.DefaultValue = fmt.Sprintf("`%v`", def)
			}
			if desc, ok := valMap["description"].(string); ok && strings.TrimSpace(desc) != "" {
				prop.Description = strings.TrimSpace(desc)
			}
		} else if val != nil {
			switch v := val.(type) {
			case bool:
				prop.Type = "boolean"
				prop.DefaultValue = fmt.Sprintf("`%v`", v)
			case float64, float32, int, int64:
				prop.Type = "number"
				prop.DefaultValue = fmt.Sprintf("`%v`", v)
			case string:
				prop.Type = "string"
				if strings.TrimSpace(v) != "" {
					prop.DefaultValue = fmt.Sprintf("`%s`", v)
				}
			default:
				prop.Type = fmt.Sprintf("%T", val)
				prop.DefaultValue = fmt.Sprintf("`%v`", val)
			}
		}

		parsed = append(parsed, prop)
	}

	sort.Slice(parsed, func(i, j int) bool {
		return parsed[i].Name < parsed[j].Name
	})

	return parsed
}

func renderJSXSnippet(compName string, isIcon bool, props []ParsedProperty) string {
	attrs := formatExampleProps(props)
	if isIcon {
		if attrs != "" {
			return fmt.Sprintf("<%s %s />", compName, attrs)
		}
		return fmt.Sprintf("<%s />", compName)
	}
	if attrs != "" {
		return fmt.Sprintf("<%s %s>\n  %s\n</%s>", compName, attrs, compName, compName)
	}
	return fmt.Sprintf("<%s>\n  %s\n</%s>", compName, compName, compName)
}

func renderVueSnippet(compName string, isIcon bool, props []ParsedProperty) string {
	attrs := formatExampleProps(props)
	if isIcon {
		if attrs != "" {
			return fmt.Sprintf("<%s %s />", compName, attrs)
		}
		return fmt.Sprintf("<%s />", compName)
	}
	if attrs != "" {
		return fmt.Sprintf("<%s %s>\n  %s\n</%s>", compName, attrs, compName, compName)
	}
	return fmt.Sprintf("<%s>\n  %s\n</%s>", compName, compName, compName)
}

func renderSvelteSnippet(compName string, isIcon bool, props []ParsedProperty) string {
	attrs := formatExampleProps(props)
	if isIcon {
		if attrs != "" {
			return fmt.Sprintf("<%s %s />", compName, attrs)
		}
		return fmt.Sprintf("<%s />", compName)
	}
	if attrs != "" {
		return fmt.Sprintf("<%s %s>\n  %s\n</%s>", compName, attrs, compName, compName)
	}
	return fmt.Sprintf("<%s>\n  %s\n</%s>", compName, compName, compName)
}

func renderAngularSnippet(kebabName string, isIcon bool, props []ParsedProperty) string {
	tag := "app-" + kebabName
	attrs := formatExampleProps(props)
	if isIcon {
		if attrs != "" {
			return fmt.Sprintf("<%s %s></%s>", tag, attrs, tag)
		}
		return fmt.Sprintf("<%s></%s>", tag, tag)
	}
	compName := domain.NormalizeComponentName(kebabName)
	if attrs != "" {
		return fmt.Sprintf("<%s %s>\n  %s\n</%s>", tag, attrs, compName, tag)
	}
	return fmt.Sprintf("<%s>\n  %s\n</%s>", tag, compName, tag)
}

func formatExampleProps(props []ParsedProperty) string {
	if len(props) == 0 {
		return ""
	}
	var pairs []string
	for _, p := range props {
		if len(pairs) >= 2 {
			break
		}
		key := strings.ToLower(p.Name[:1]) + p.Name[1:]
		val := strings.Trim(strings.Trim(p.DefaultValue, "`"), "\"")
		if p.Type == "boolean" {
			if strings.EqualFold(val, "true") {
				pairs = append(pairs, key)
			} else {
				pairs = append(pairs, fmt.Sprintf("%s={false}", key))
			}
		} else {
			if val == "" || val == "-" {
				val = "default"
			}
			isCustomLabel := strings.Contains(strings.ToLower(p.Name), "label") ||
				strings.Contains(strings.ToLower(p.Name), "title") ||
				strings.Contains(strings.ToLower(p.Name), "text") ||
				strings.Contains(val, " ")
			if !isCustomLabel {
				val = strings.ToLower(val)
			}
			pairs = append(pairs, fmt.Sprintf("%s=%q", key, val))
		}
	}
	return strings.Join(pairs, " ")
}

func indentCode(code string, prefix string) string {
	lines := strings.Split(code, "\n")
	for i, l := range lines {
		if l != "" {
			lines[i] = prefix + l
		}
	}
	return strings.Join(lines, "\n")
}

func generateA11ySection(compName string, isIcon bool) string {
	var sb strings.Builder
	lower := strings.ToLower(compName)

	if isIcon {
		sb.WriteString("- **Decorative Icons**: When used purely for visual enhancement, apply `aria-hidden=\"true\"` to hide from assistive technologies.\n")
		sb.WriteString("- **Standalone / Meaningful Icons**: When an icon conveys semantic meaning or triggers an action, supply an accessible name using `aria-label` or an adjacent visually hidden label.\n")
		sb.WriteString("- **Contrast**: Non-text elements must satisfy a minimum 3:1 contrast ratio against adjacent colors per WCAG 2.1 (1.4.11 Non-text Contrast).\n")
		return sb.String()
	}

	if strings.Contains(lower, "button") {
		sb.WriteString("- **Native Semantics**: Renders a semantic `<button>` element with built-in accessibility semantics.\n")
		sb.WriteString("- **Keyboard Activation**: Fully operable using both the <kbd>Enter</kbd> and <kbd>Space</kbd> keys.\n")
		sb.WriteString("- **Focus Indicator**: Visible `:focus-visible` outline must not be suppressed without providing an accessible alternative.\n")
		sb.WriteString("- **State Announcement**: Use `aria-disabled=\"true\"` or native `disabled` attribute to convey unclickable states to screen readers.\n")
		return sb.String()
	}

	if strings.Contains(lower, "input") || strings.Contains(lower, "field") || strings.Contains(lower, "text") {
		sb.WriteString("- **Form Label Association**: Ensure every input is explicitly associated with a `<label>` element using `id` and `for` / `htmlFor`.\n")
		sb.WriteString("- **Validation Errors**: Announce field error messages using `aria-describedby` referencing the error container.\n")
		sb.WriteString("- **Required & Disabled States**: Reflect state with `aria-required=\"true\"` and `aria-invalid` when inputs fail validation.\n")
		return sb.String()
	}

	if strings.Contains(lower, "modal") || strings.Contains(lower, "dialog") {
		sb.WriteString("- **Role & Modal Scope**: Container must declare `role=\"dialog\"` and `aria-modal=\"true\"`.\n")
		sb.WriteString("- **Focus Trap**: Traps keyboard focus within the dialog until dismissed via <kbd>Esc</kbd> or close button.\n")
		sb.WriteString("- **Accessible Title**: Tagged with `aria-labelledby` referencing the dialog heading.\n")
		return sb.String()
	}

	sb.WriteString("- **Keyboard Navigation**: Ensure interactive child elements are reachable and operable via standard keyboard sequences (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>).\n")
	sb.WriteString("- **WAI-ARIA Roles & States**: Appropriate ARIA roles and dynamic state attributes (e.g. `aria-expanded`, `aria-selected`, `aria-hidden`) reflect component status.\n")
	sb.WriteString("- **Color Contrast**: All typography and interactive UI boundaries satisfy WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text and UI components).\n")
	return sb.String()
}
