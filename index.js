#!/usr/bin/env node

import fs from "fs/promises"
import { spawnSync } from "child_process"

const path = "./package.json"
const eslintConfig = "./.eslintrc.json"
const dependenciesToRemove = [
  /^.*@typescript-eslint\/eslint-plugin.*$/,
  /^.*@typescript-eslint\/parser.*$/,
  /^.*"eslint".*$/,
  /^.*eslint-plugin-react-hooks.*$/,
  /^.*eslint-plugin-react-refresh.*$/,
];

async function removeLines(regexList) {
  const data = await fs.readFile(path, 'utf-8')
  const lines = data.split('\n');
  const filteredLines = lines.filter(line => {
    return !regexList.some(regex => regex.test(line));
  });

  const updatedContent = filteredLines.join('\n');
  await fs.writeFile(path, updatedContent);
}

async function correctLintCmd() {
  try {
    const data = await fs.readFile(path, 'utf-8')
    let formatted = data.replace(/^.*"lint".*$/m, '\t\t"lint": "eslint -c .eslintrc.json . --ext .js,.jsx,.ts,.tsx",');
    await fs.writeFile(path, formatted);
  } catch (err) {
    console.error(err);
  }
}

async function createConfigFile() {
  try {
    await fs.writeFile(eslintConfig, '{\n"extends": "@trybe/eslint-config-frontend/typescript"\n}');
    await fs.unlink(".eslintrc.cjs");
  } catch (err) {
    console.error(err);
  }
}

async function checkViteConfig() {
  try {
    await fs.access("vite.config.ts", fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

function installPackage() {
  spawnSync("npm", ["install", "@trybe/eslint-config-frontend", "-D"], { stdio: 'inherit' })
}

async function main() {
  if (await checkViteConfig()) {
    await removeLines(dependenciesToRemove);
    await correctLintCmd();
    await createConfigFile();
    installPackage();
  } else {
    console.log("Diretório atual não é um projeto Vite");
  }
}

main()
