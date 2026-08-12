#!/usr/bin/env node
/**
 * Runs the Angular CLI with a larger Node heap.
 *
 * The production build otherwise fails with
 *   "Optimization error: DataCloneError: Data cannot be cloned, out of memory"
 * because the bundle is large enough that the default heap cannot optimize it.
 *
 * This has to be NODE_OPTIONS rather than `node --max-old-space-size=... ng`:
 * the CLI spawns esbuild optimizer workers as separate processes, and only the
 * environment variable reaches them.
 *
 * Cross-platform, and avoids adding cross-env as a dependency.
 */
const { spawn } = require('child_process');
const path = require('path');

const HEAP_MB = process.env.NG_HEAP_MB || '8192';
const existing = process.env.NODE_OPTIONS ? process.env.NODE_OPTIONS + ' ' : '';

const cli = path.join(__dirname, '..', 'node_modules', '@angular', 'cli', 'bin', 'ng.js');

const child = spawn(process.execPath, [cli, ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: { ...process.env, NODE_OPTIONS: `${existing}--max-old-space-size=${HEAP_MB}` }
});

child.on('exit', code => process.exit(code ?? 1));
child.on('error', err => {
  console.error('Failed to start the Angular CLI:', err.message);
  process.exit(1);
});
