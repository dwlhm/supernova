#!/usr/bin/env node
import { compileMitosis } from './compiler.js';
import type { CompileRequest, CompileResponse } from './types.js';

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
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf-8');
}

async function main(): Promise<void> {
  let rawInput = '';
  try {
    rawInput = await readStdin();
  } catch (err: unknown) {
    const errorResponse: CompileResponse = {
      success: false,
      artifacts: [],
      errors: [
        {
          target: 'cli',
          message: `Failed to read stdin: ${err instanceof Error ? err.message : String(err)}`,
        },
      ],
    };
    process.stdout.write(JSON.stringify(errorResponse, null, 2) + '\n');
    process.exitCode = 1;
    return;
  }

  let request: CompileRequest;
  try {
    request = JSON.parse(rawInput);
  } catch (err: unknown) {
    const errorResponse: CompileResponse = {
      success: false,
      artifacts: [],
      errors: [
        {
          target: 'cli',
          message: `Failed to parse JSON stdin: ${err instanceof Error ? err.message : String(err)}`,
        },
      ],
    };
    process.stdout.write(JSON.stringify(errorResponse, null, 2) + '\n');
    process.exitCode = 1;
    return;
  }

  try {
    const result = await compileMitosis(request);
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
    process.exitCode = result.success ? 0 : 1;
  } catch (err: unknown) {
    const errorResponse: CompileResponse = {
      success: false,
      artifacts: [],
      errors: [
        {
          target: 'cli',
          message: `Unexpected compilation error: ${err instanceof Error ? err.message : String(err)}`,
        },
      ],
    };
    process.stdout.write(JSON.stringify(errorResponse, null, 2) + '\n');
    process.exitCode = 1;
  }
}

main().catch((err: unknown) => {
  const errorResponse: CompileResponse = {
    success: false,
    artifacts: [],
    errors: [
      {
        target: 'cli',
        message: `Fatal error: ${err instanceof Error ? err.message : String(err)}`,
      },
    ],
  };
  process.stdout.write(JSON.stringify(errorResponse, null, 2) + '\n');
  process.exitCode = 1;
});
