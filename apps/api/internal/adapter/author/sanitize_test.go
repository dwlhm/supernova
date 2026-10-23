package author

import (
	"testing"

	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

func TestSanitizeResult_DropsUnsafeLLMOutput(t *testing.T) {
	resp := authorCLIResponse{
		Success: true,
		Components: map[string]string{
			"Button":           "ok",
			"../../etc/x":      "evil",
			"Card;import('x')": "evil",
		},
		ComponentGroups: map[string]string{"Button": "Components", "Card": "../../x"},
		Artifacts: []authorCLIArtifact{
			{Target: contracts.Mitosis, FileName: "Button.lite.tsx", Code: "ok"},
			{Target: contracts.Mitosis, FileName: "../../../root/.ssh/authorized_keys", Code: "evil"},
			{Target: contracts.Mitosis, FileName: "Card.lite.tsx", Group: "../escape", Code: "evil"},
			{Target: contracts.Mitosis, FileName: "IconX.lite.tsx", Group: "icons", Code: "ok"},
		},
	}

	got := sanitizeResult(resp)

	if len(got.Components) != 1 || got.Components["Button"] != "ok" {
		t.Errorf("components = %v, want only Button", got.Components)
	}
	if len(got.ComponentGroups) != 1 || got.ComponentGroups["Button"] != "components" {
		t.Errorf("groups = %v, want only Button=components", got.ComponentGroups)
	}
	if len(got.Artifacts) != 2 {
		t.Fatalf("artifacts = %+v, want Button and IconX only", got.Artifacts)
	}
	if got.Artifacts[0].FileName != "Button.lite.tsx" || got.Artifacts[0].Group != "components" {
		t.Errorf("Button artifact = %+v, want group inherited from componentGroups", got.Artifacts[0])
	}
	if got.Artifacts[1].FileName != "IconX.lite.tsx" || got.Artifacts[1].Group != "icons" {
		t.Errorf("IconX artifact = %+v", got.Artifacts[1])
	}
}
