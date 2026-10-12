# Hexagonal Architecture

The Supernova backend (`apps/api`) strictly follows **Alistair Cockburn's Hexagonal Architecture** (Ports and Adapters pattern).

## Dependency Rule

Dependencies always point inwards toward the core domain:

```
[ Inbound Adapters ]             [ Core Application ]            [ Outbound Adapters ]
  HTTP Handler        ----->     in.Service (Port)     ----->     MitosisAuthor (Port)
  (net/http Mux)                 Job State Machine                LLM Client Adapter
                                 Repair Loop                      (packages/mitosis-author)
                                 Worker Pool
                                                       ----->     MitosisCompiler (Port)
                                                                  CLI Subprocess Adapter
                                                                  (packages/mitosis-compiler)
                                                       ----->     JobStore (Port)
                                                                  In-Memory / SQLite Store
                                                       ----->     ArtifactPublisher (Port)
                                                                  Download ZIP Publisher
                                                                  GitHub PR Publisher
```

### Core Domain (`internal/core/domain/`)
- Contains pure entity models: `Job`, `FigmaComponentSpec`, `CompiledArtifact`, `Framework`, and domain error sentinels.
- Contains pure utility functions like `NormalizeComponentName` without I/O or system side effects.
- Zero dependencies on external frameworks, HTTP routers, or database drivers.

### Inbound Ports (`internal/core/port/in/`)
- `Service`: Defines the primary use cases:
  - `SubmitExtraction(ctx, req) (jobID, error)`
  - `GetJob(ctx, jobID) (*domain.Job, error)`
  - `GetDownloadZip(ctx, jobID) ([]byte, error)`

### Outbound Ports (`internal/core/port/out/`)
- `MitosisAuthor`: Abstraction for authoring `.lite.tsx` components.
- `MitosisCompiler`: Abstraction for compiling to framework targets.
- `JobStore`: Abstraction for persisting jobs and artifact payloads.
- `ArtifactPublisher`: Abstraction for delivering artifacts (ZIP bundle, GitHub PR).

### Automatic Repair Loop
If the compiler reports syntax or semantic errors in generated Mitosis code:
1. Attempt 0: LLM generates initial `.lite.tsx`.
2. Compiler parses and compiles to target frameworks.
3. If errors are detected and `attempts < maxRetries`:
   - Errors are captured and passed into the LLM prompt under `CRITICAL REPAIR REQUIRED:`.
   - LLM corrects the source code addressing the specific compiler messages.
4. If compilation passes: Component is marked `done` and artifacts are stored.
5. If retries are exhausted: Component is marked `failed` with stage and error details, and the job continues processing remaining components.
