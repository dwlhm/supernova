package app

import (
	"sync"
	"time"

	contracts "github.com/dwlhm/supernova/packages/contracts/gen"
)

// StringPtr returns a pointer to the provided string.
func StringPtr(s string) *string {
	return &s
}

// EventBroker manages pub/sub subscriptions for real-time SSE job events.
type EventBroker struct {
	mu          sync.RWMutex
	subscribers map[string]map[chan contracts.JobEvent]struct{}
}

// NewEventBroker creates a new event broker.
func NewEventBroker() *EventBroker {
	return &EventBroker{
		subscribers: make(map[string]map[chan contracts.JobEvent]struct{}),
	}
}

// Subscribe returns an event channel for a job and an unsubscribe function.
func (b *EventBroker) Subscribe(jobID string) (<-chan contracts.JobEvent, func()) {
	b.mu.Lock()
	defer b.mu.Unlock()

	ch := make(chan contracts.JobEvent, 64)
	if b.subscribers[jobID] == nil {
		b.subscribers[jobID] = make(map[chan contracts.JobEvent]struct{})
	}
	b.subscribers[jobID][ch] = struct{}{}

	var once sync.Once
	unsubscribe := func() {
		once.Do(func() {
			b.mu.Lock()
			defer b.mu.Unlock()
			if subs, exists := b.subscribers[jobID]; exists {
				delete(subs, ch)
				close(ch)
				if len(subs) == 0 {
					delete(b.subscribers, jobID)
				}
			}
		})
	}

	return ch, unsubscribe
}

// Publish sends an event to all active subscribers of the job without blocking.
func (b *EventBroker) Publish(jobID string, event contracts.JobEvent) {
	b.mu.RLock()
	defer b.mu.RUnlock()

	if event.Timestamp.IsZero() {
		event.Timestamp = time.Now().UTC()
	}

	subs, exists := b.subscribers[jobID]
	if !exists {
		return
	}

	for ch := range subs {
		select {
		case ch <- event:
		default:
			// Buffer full, skip to avoid blocking other subscribers
		}
	}
}
