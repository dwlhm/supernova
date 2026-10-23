package domain

import "errors"

var (
	// ErrJobNotFound is returned when a requested job ID is not in the store.
	ErrJobNotFound = errors.New("job not found")

	// ErrJobNotFinished is returned when requesting artifacts/download for a job that is not succeeded.
	ErrJobNotFinished = errors.New("job not finished")

	// ErrInvalidPayload is returned when an incoming extraction request payload fails validation.
	ErrInvalidPayload = errors.New("invalid payload")

	// ErrExtractionNotFound is returned when replaying an extraction that was never persisted.
	ErrExtractionNotFound = errors.New("extraction not found")

	// ErrComponentNotFound is returned when a requested component snapshot is not found.
	ErrComponentNotFound = errors.New("component not found")

	// ErrSyncPlanNotFound is returned when a requested sync plan is not found.
	ErrSyncPlanNotFound = errors.New("sync plan not found")
)
