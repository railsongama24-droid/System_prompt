#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const SKILL_NAME = 'code-agent-prompt-architect';
const SOURCE_DIR = path.join(__dirname, '..', 'skill', SKILL_NAME);

const TARGET_ROOTS = [
  path.join(os.homedir(), '.claude', 'skills'),
  path.join(os.homedir(), '.codex', 'skills'),
  path.join(os.homedir(), '.config', 'opencode', 'skills'),
  path.join(os.homedir(), '.agents', 'skills'),
];

function install() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`[prompt-architect] source skill dir not found: ${SOURCE_DIR}`);
    process.exitCode = 1;
    return;
  }

  let successCount = 0;
  for (const root of TARGET_ROOTS) {
    const dest = path.join(root, SKILL_NAME);
    try {
      fs.mkdirSync(root, { recursive: true });
      fs.cpSync(SOURCE_DIR, dest, { recursive: true, force: true });
      console.log(`[prompt-architect] installed -> ${dest}`);
      successCount++;
    } catch (err) {
      console.warn(`[prompt-architect] skipped ${dest}: ${err.message}`);
    }
  }

  if (successCount === 0) {
    console.error('[prompt-architect] failed to install to any target location.');
    process.exitCode = 1;
  } else {
    console.log(`[prompt-architect] done (${successCount}/${TARGET_ROOTS.length} locations).`);
  }
}

install();
