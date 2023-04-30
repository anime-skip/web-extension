/// <reference types="vitest" />

import { defineConfig, Plugin } from 'vite';
import { execSync } from 'node:child_process';
import vue from '@vitejs/plugin-vue';
import autoImport from 'unplugin-auto-import/vite';
import icons from 'unplugin-icons/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'node:path';

function vueTsc(): Plugin {
  let alreadyExecuted = false;
  return {
    name: 'vue-tsc',
    writeBundle() {
      if (alreadyExecuted) return;

      console.log('Generating types...');
      execSync('vue-tsc -p tsconfig.build.json --emitDeclarationOnly', {
        stdio: 'inherit',
      });
      alreadyExecuted = true;
    },
  };
}

function generate(): Plugin {
  return {
    name: 'generate',
    buildStart() {
      execSync('pnpm generate:graphql');
    },
  };
}

// Random seed used for randomized data in tests
const __TEST_SEED__ = process.env.TEST_SEED
  ? Number(process.env.TEST_SEED)
  : Math.round(Number.MAX_SAFE_INTEGER * Math.random());
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === 'test') {
    console.log(`Random seed: \x1b[1m\x1b[36m${__TEST_SEED__}\x1b[0m`);
  }

  return {
    test: {
      mockReset: true,
      restoreMocks: true,
    },
    plugins: [
      visualizer(),
      vueTsc(),
      vue(),
      generate(),
      icons({
        scale: 24 / 14, // 14px is the default size in px, so the first number is the desired size in px
        customCollections: {
          'anime-skip': FileSystemIconLoader('./src/assets/icons', (svg) =>
            svg.replace(/fill="white"/g, 'fill="currentColor"'),
          ),
        },
      }),
      autoImport({
        dts: 'src/@types/auto-import.d.ts',
        dirs: ['src/composables'],
        defaultExportByFilename: true,
        imports: [
          'vue',
          '@vueuse/core',
          {
            'vue-query': ['useQuery', 'useMutation', 'useQueryClient'],
          },
        ],
      }),
    ],
    build: {
      lib: {
        name: 'animeSkipPlayer',
        entry: 'src/index.ts',
        formats: ['cjs', 'iife', 'es'],
        fileName: 'index',
      },
      sourcemap: true,
    },
    define: {
      __TEST_SEED__: JSON.stringify(__TEST_SEED__),
    },
  };
});
