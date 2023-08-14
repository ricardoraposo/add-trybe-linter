#!/usr/bin/env node

import fs from "fs";

const dependiciesToRemove = [
  /^.*@typescript-eslint\/eslint-plugin.*$/,
  /^.*@typescript-eslint\/parser.*$/,
  /^.*"eslint".*$/,
  /^.*eslint-plugin-react-hooks.*$/,
  /^.*eslint-plugin-react-refresh.*$/,
]

const path = "./package.json"

function removeLines(regexList) {
  fs.readFile(path, 'utf-8', (_, data) => {
    const lines = data.split('\n');
    const filteredLines = lines.filter(line => {
      return !regexList.some(regex => regex.test(line));
    });

    const updatedContent = filteredLines.join('\n');

    fs.writeFile(path, updatedContent, 'utf-8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
      } else {
        console.log('Lines removed successfully');
      }
    });
  })
}

removeLines(dependiciesToRemove);
