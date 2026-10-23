package app_test

import (
	"context"
	"testing"
	"time"

	"github.com/dwlhm/supernova/apps/api/internal/adapter/memstore"
	"github.com/dwlhm/supernova/apps/api/internal/core/app"
	"github.com/dwlhm/supernova/apps/api/internal/core/domain"
	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

func TestCalculateSyncPlan_NewUnchangedChangedRemoved(t *testing.T) {
	ctx := context.Background()
	store := memstore.New()
	docName := "DesignSystem"

	// 1. First sync: empty store -> all new
	btnSpec := contracts.FigmaComponentSpec{
		Id:   "c1",
		Name: "Button",
		Node: contracts.FigmaSceneNode{Id: "n1", Name: "Button", Type: "FRAME"},
	}
	badgeSpec := contracts.FigmaComponentSpec{
		Id:   "c2",
		Name: "Badge",
		Node: contracts.FigmaSceneNode{Id: "n2", Name: "Badge", Type: "FRAME"},
	}

	req1 := contracts.SyncRequest{
		Document: contracts.FigmaDocument{
			Name:       docName,
			Components: []contracts.FigmaComponentSpec{btnSpec, badgeSpec},
			Tokens: []contracts.FigmaToken{
				{Id: "t1", Name: "color.primary", Type: "color", Value: "#111111"},
			},
		},
	}

	plan1, err := app.CalculateSyncPlan(ctx, store, req1)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if plan1.Summary.New != 2 || plan1.Summary.Changed != 0 || plan1.Summary.Unchanged != 0 {
		t.Fatalf("expected 2 new, got %+v", plan1.Summary)
	}

	// 2. Simulate saving snapshots after successful execution
	btnHash := domain.HashComponentSpec(btnSpec)
	badgeHash := domain.HashComponentSpec(badgeSpec)
	now := time.Now().UTC()

	_ = store.SaveSnapshot(ctx, &domain.Snapshot{
		ID:           "s1",
		DocumentName: docName,
		TokensHash:   domain.HashTokens(req1.Document.Tokens),
		Tokens:       req1.Document.Tokens,
		CreatedAt:    now,
	})
	_ = store.SaveComponentSnapshot(ctx, &domain.ComponentSnapshot{
		DocumentName:  docName,
		ComponentName: "Button",
		ContentHash:   btnHash,
		SourceCode:    "export default function Button() {}",
		UpdatedAt:     now,
	})
	_ = store.SaveComponentSnapshot(ctx, &domain.ComponentSnapshot{
		DocumentName:  docName,
		ComponentName: "Badge",
		ContentHash:   badgeHash,
		SourceCode:    "export default function Badge() {}",
		UpdatedAt:     now,
	})

	// 3. Second sync: Button unchanged, Badge modified, Card added
	modBadgeSpec := badgeSpec
	desc := "Updated badge description"
	modBadgeSpec.Description = &desc

	cardSpec := contracts.FigmaComponentSpec{
		Id:   "c3",
		Name: "Card",
		Node: contracts.FigmaSceneNode{Id: "n3", Name: "Card", Type: "FRAME"},
	}

	req2 := contracts.SyncRequest{
		Document: contracts.FigmaDocument{
			Name:       docName,
			Components: []contracts.FigmaComponentSpec{btnSpec, modBadgeSpec, cardSpec},
			Tokens: []contracts.FigmaToken{
				{Id: "t1", Name: "color.primary", Type: "color", Value: "#111111"},
			},
		},
	}

	plan2, err := app.CalculateSyncPlan(ctx, store, req2)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if plan2.Summary.New != 1 || plan2.Summary.Changed != 1 || plan2.Summary.Unchanged != 1 || plan2.Summary.Removed != 0 {
		t.Fatalf("expected 1 new (Card), 1 changed (Badge), 1 unchanged (Button), got: %+v", plan2.Summary)
	}
	if plan2.Summary.TokensChanged {
		t.Errorf("expected tokens not changed")
	}

	// 4. Third sync: Badge deleted from incoming document
	req3 := contracts.SyncRequest{
		Document: contracts.FigmaDocument{
			Name:       docName,
			Components: []contracts.FigmaComponentSpec{btnSpec},
			Tokens: []contracts.FigmaToken{
				{Id: "t1", Name: "color.primary", Type: "color", Value: "#999999"}, // modified token
				{Id: "t2", Name: "spacing.sm", Type: "spacing", Value: 8},          // added token
			},
		},
	}

	plan3, err := app.CalculateSyncPlan(ctx, store, req3)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if plan3.Summary.Removed != 1 {
		t.Fatalf("expected 1 removed component (Badge), got %+v", plan3.Summary)
	}
	if !plan3.Summary.TokensChanged {
		t.Fatalf("expected tokensChanged to be true")
	}
	if len(*plan3.Tokens.Added) != 1 || len(*plan3.Tokens.Modified) != 1 {
		t.Fatalf("expected 1 added and 1 modified token, got: %+v", plan3.Tokens)
	}
}
