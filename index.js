#!/usr/bin/env node

const fs = require("fs").promises;
const { execSync } = require("child_process");

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
  const cmd = "npm install @trybe/eslint-config-frontend -D"
  execSync(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error(`Erro ao instalar o pacote: ${err.message}`);
      return;
    }

    console.log(`Pacote instalado com sucesso!`);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
  })
}

async function main() {
  if (await checkViteConfig()) {
    await removeLines(dependenciesToRemove);
    await createConfigFile();
    installPackage();
  } else {
    console.log("Diretório atual não é um projeto Vite");
  }
}

main()
