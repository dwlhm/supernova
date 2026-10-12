#!/usr/bin/env node
import { runAuthorAgent } from './agent.js';
import { getAuthorConfig } from './config.js';
import type { AuthorAgentResponse } from './agent.js';

console.log = (...args: any[]) => {
  console.error(...args);
};
console.info = (...args: any[]) => {
  console.error(...args);
};
console.warn = (...args: any[]) => {
  console.error(...args);
};

async function readStdin(): Promise<string> {
  if (process.stdin.isTTY) {
    return '';
  }
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf-8');
}

function writeOutput(response: AuthorAgentResponse, exitCode: number): void {
  process.stdout.write(JSON.stringify(response, null, 2) + '\n');
  process.exitCode = exitCode;
}

async function main(): Promise<void> {
  // Pure environment variables guard
  try {
    getAuthorConfig();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    writeOutput(
      {
        success: false,
        components: {},
        componentGroups: {},
        artifacts: [],
        newTokens: [],
        error: message,
      },
      1
    );
    return;
  }

  let rawInput = '';
  try {
    rawInput = await readStdin();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    writeOutput(
      {
        success: false,
        components: {},
        componentGroups: {},
        artifacts: [],
        newTokens: [],
        error: `Failed to read stdin: ${message}`,
      },
      1
    );
    return;
  }

  let req: any = {};
  if (rawInput.trim()) {
    try {
      req = JSON.parse(rawInput);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      writeOutput(
        {
          success: false,
          components: {},
          componentGroups: {},
          artifacts: [],
          newTokens: [],
          error: `Failed to parse JSON stdin: ${message}`,
        },
        1
      );
      return;
    }
  }

  try {
    const result = await runAuthorAgent(req);
    writeOutput(result, result.success ? 0 : 1);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    writeOutput(
      {
        success: false,
        components: {},
        componentGroups: {},
        artifacts: [],
        newTokens: [],
        error: `Unexpected error: ${message}`,
      },
      1
    );
  }
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  writeOutput(
    {
      success: false,
      components: {},
      componentGroups: {},
      artifacts: [],
      newTokens: [],
      error: `Fatal error: ${message}`,
    },
    1
  );
});
