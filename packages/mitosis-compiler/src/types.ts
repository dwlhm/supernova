export type TargetFramework = 'mitosis' | 'react' | 'svelte' | 'vue3' | 'vue2' | 'angular';

export interface CompileRequest {
  componentName: string;
  source: string;
  targets?: TargetFramework[];
  allowedClasses?: string[];
  checks?: { lint?: boolean; render?: boolean; targets?: boolean };
  siblingSources?: Record<string, string>;
}

export interface CompiledArtifact {
  target: TargetFramework;
  fileName: string;
  code: string;
}

export interface CompileError {
  target?: string;
  message: string;
  line?: number;
  rule?: string;
}

export interface CompileResponse {
  success: boolean;
  artifacts: CompiledArtifact[];
  errors: CompileError[];
}
