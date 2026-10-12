module github.com/dwlhm/supernova/apps/api

go 1.25

require (
	github.com/dwlhm/supernova/packages/contracts v0.0.0
	github.com/google/go-github/v69 v69.2.0
	github.com/google/uuid v1.6.0
)

require (
	github.com/google/go-querystring v1.1.0 // indirect
	github.com/oapi-codegen/runtime v1.1.1 // indirect
)

replace github.com/dwlhm/supernova/packages/contracts => ../../packages/contracts
