package domain

import "errors"

var (
	// ErrJobNotFound is returned when a requested job ID is not in the store.
	ErrJobNotFound = errors.New("job not found")

	// ErrJobNotFinished is returned when requesting artifacts/download for a job that is not succeeded.
	ErrJobNotFinished = errors.New("job not finished")

	// ErrInvalidPayload is returned when an incoming extraction request payload fails validation.
	ErrInvalidPayload = errors.New("invalid payload")
)
