---
layout: home

hero:
  name: "Supernova"
  text: "Figma to Multi-Framework Pipeline"
  tagline: "Extract entire Figma documents, author headless Mitosis components via LLM, and compile to React, Svelte, Vue 3, Vue 2, and Angular."
  actions:
    - theme: brand
      text: Get Started
      link: /guide/overview
    - theme: alt
      text: Architecture
      link: /guide/architecture

features:
  - title: Whole Document Extraction
    details: Custom Figma plugin using loadAllPagesAsync() traverses every page, collecting design tokens (variables, paint styles, text styles) and component sets.
  - title: Hexagonal Go Orchestrator
    details: Clean Ports & Adapters architecture isolating domain logic from HTTP, filesystem, subprocesses, and AI providers.
  - title: LLM Mitosis Authoring & Repair Loop
    details: OpenAI-compatible authoring client (Ollama, OpenAI, vLLM) with structured output and automated compiler feedback repair loop.
  - title: 5 Target Frameworks
    details: Compiles single-source Mitosis .lite.tsx components simultaneously to React, Svelte, Vue 3, Vue 2, and Angular.
  - title: Dual Publishers
    details: Download complete multi-framework zip bundles directly from the plugin or create automated GitHub Pull Requests.
---
