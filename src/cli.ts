#!/usr/bin/env node
/* eslint-disable no-console */
import { promises as fs } from 'node:fs';
import * as path from 'node:path';

async function listFilesRecursively(dir: string, cwd: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listFilesRecursively(fullPath, cwd));
    } else if (entry.isFile()) {
      const relative = path.relative(cwd, fullPath);
      files.push(`@/${relative.replace(/\\/g, '/')}`); // normaliza separadores no Windows
    }
  }

  return files;
}

async function main(): Promise<void> {
  const [, , rawDir] = process.argv;

  if (!rawDir || ['-h', '--help'].includes(rawDir)) {
    console.log('Uso: kfolder <caminho-relativo>');
    process.exit(rawDir ? 0 : 1);
  }

  const cwd = process.cwd();
  const targetDir = path.resolve(cwd, rawDir);

  try {
    const stats = await fs.stat(targetDir);
    if (!stats.isDirectory()) throw new Error('O caminho não é um diretório.');
  } catch (err) {
    console.error('Erro: caminho inexistente ou inacessível:', rawDir);
    process.exit(1);
  }

  const files = await listFilesRecursively(targetDir, cwd);
  files.sort((a, b) => a.localeCompare(b, 'pt-BR'));

  const output = files.join('\n');
  console.log(output);

  await fs.writeFile(path.join(cwd, 'kfolder.txt'), output + '\n', 'utf8');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
