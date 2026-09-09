#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const SKILL_NAME = 'code-agent-prompt-architect';

const TARGET_ROOTS = [
  path.join(os.homedir(), '.claude', 'skills'),
  path.join(os.homedir(), '.codex', 'skills'),
  path.join(os.homedir(), '.config', 'opencode', 'skills'),
  path.join(os.homedir(), '.agents', 'skills'),
];

function uninstall() {
  let removedCount = 0;
  for (const root of TARGET_ROOTS) {
    const dest = path.join(root, SKILL_NAME);
    try {
      if (fs.existsSync(dest)) {
        fs.rmSync(dest, { recursive: true, force: true });
        console.log(`[prompt-architect] removed -> ${dest}`);
        removedCount++;
      }
    } catch (err) {
      console.warn(`[prompt-architect] could not remove ${dest}: ${err.message}`);
    }
  }

  console.log(`[prompt-architect] uninstall done (${removedCount} location(s) cleaned).`);
}

uninstall();
