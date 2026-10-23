package domain_test

import (
	"testing"

	"github.com/dwlhm/supernova/apps/api/internal/core/domain"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

func strPtr(s string) *string {
	return &s
}

func TestHashComponentSpec_Deterministic(t *testing.T) {
	spec1 := contracts.FigmaComponentSpec{
		Id:          "comp-1",
		Name:        "Button",
		Description: strPtr("A button component"),
		Node: contracts.FigmaSceneNode{
			Id:   "node-1",
			Name: "Button",
			Type: "FRAME",
		},
	}

	spec2 := contracts.FigmaComponentSpec{
		Id:          "comp-1",
		Name:        "Button",
		Description: strPtr("A button component"),
		Node: contracts.FigmaSceneNode{
			Id:   "node-1",
			Name: "Button",
			Type: "FRAME",
		},
	}

	hash1 := domain.HashComponentSpec(spec1)
	hash2 := domain.HashComponentSpec(spec2)

	if hash1 == "" {
		t.Fatalf("expected non-empty hash")
	}
	if hash1 != hash2 {
		t.Fatalf("expected identical hashes, got %s and %s", hash1, hash2)
	}

	// Change description -> hash must change
	spec3 := spec1
	spec3.Description = strPtr("Changed description")
	hash3 := domain.HashComponentSpec(spec3)
	if hash1 == hash3 {
		t.Fatalf("expected different hash when spec changes")
	}
}

func TestHashTokens_OrderIndependent(t *testing.T) {
	t1 := contracts.FigmaToken{Id: "1", Name: "color.primary", Type: "color", Value: "#ff0000"}
	t2 := contracts.FigmaToken{Id: "2", Name: "color.secondary", Type: "color", Value: "#00ff00"}

	tokensA := []contracts.FigmaToken{t1, t2}
	tokensB := []contracts.FigmaToken{t2, t1}

	hashA := domain.HashTokens(tokensA)
	hashB := domain.HashTokens(tokensB)

	if hashA == "" {
		t.Fatalf("expected non-empty tokens hash")
	}
	if hashA != hashB {
		t.Fatalf("expected identical token hashes regardless of slice order, got %s and %s", hashA, hashB)
	}
}
