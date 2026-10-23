package domain_test

import (
	"errors"
	"testing"

	"github.com/dwlhm/supernova/apps/api/internal/core/domain"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

func TestArtifactPath_Layout(t *testing.T) {
	cases := []struct {
		art  domain.CompiledArtifact
		want string
	}{
		{domain.CompiledArtifact{Target: contracts.Mitosis, FileName: "Button.lite.tsx"}, "src/components/Button.lite.tsx"},
		{domain.CompiledArtifact{Target: contracts.Mitosis, FileName: "IconX.lite.tsx", Group: "Icons"}, "src/icons/IconX.lite.tsx"},
		{domain.CompiledArtifact{Target: contracts.Mitosis, FileName: "utils.ts", Group: "icons"}, "src/components/utils.ts"},
		{domain.CompiledArtifact{Target: contracts.Framework("tokens"), FileName: "theme.css"}, "src/tokens/theme.css"},
		{domain.CompiledArtifact{Target: contracts.Framework("docs"), FileName: "tokens.md"}, "docs/tokens.md"},
		{domain.CompiledArtifact{Target: contracts.Framework("docs"), FileName: "button.md"}, "docs/components/button.md"},
		{domain.CompiledArtifact{Target: contracts.Framework("figma"), FileName: "figma-document.json"}, "figma-document.json"},
	}
	for _, c := range cases {
		got, err := domain.ArtifactPath(c.art)
		if err != nil || got != c.want {
			t.Errorf("ArtifactPath(%+v) = %q, %v; want %q", c.art, got, err, c.want)
		}
	}
}

func TestArtifactPath_RejectsUnsafeInput(t *testing.T) {
	for _, art := range []domain.CompiledArtifact{
		{Target: contracts.Mitosis, FileName: "../x.lite.tsx"},
		{Target: contracts.Mitosis, FileName: "a/b.lite.tsx"},
		{Target: contracts.Mitosis, FileName: `a\b.lite.tsx`},
		{Target: contracts.Mitosis, FileName: "/etc/passwd"},
		{Target: contracts.Mitosis, FileName: ".hidden"},
		{Target: contracts.Mitosis, FileName: "x..lite.tsx"},
		{Target: contracts.Mitosis, FileName: ""},
		{Target: contracts.Mitosis, FileName: "Ok.lite.tsx", Group: "../../etc"},
		{Target: contracts.Mitosis, FileName: "Ok.lite.tsx", Group: "hooks"},
	} {
		if _, err := domain.ArtifactPath(art); !errors.Is(err, domain.ErrUnsafeArtifact) {
			t.Errorf("ArtifactPath(%+v): expected ErrUnsafeArtifact, got %v", art, err)
		}
	}
	if _, err := domain.ArtifactPath(domain.CompiledArtifact{Target: contracts.React, FileName: "Button.tsx"}); !errors.Is(err, domain.ErrUnpublishedTarget) {
		t.Errorf("expected ErrUnpublishedTarget for react, got %v", err)
	}
}

func TestValidComponentName(t *testing.T) {
	for name, want := range map[string]bool{
		"Button": true, "IconX2": true, "button": false, "../Button": false, "Button;alert(1)": false,
		"Button/../../x": false, "": false, "Ab-c": false,
	} {
		if got := domain.ValidComponentName(name); got != want {
			t.Errorf("ValidComponentName(%q) = %v, want %v", name, got, want)
		}
	}
}
