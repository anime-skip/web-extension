import vue from '@vitejs/plugin-vue';
import components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import icons from 'unplugin-icons/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import IconResolver from 'unplugin-icons/resolver';
import path from 'node:path';

export default defineConfig({
  plugins: [
    icons({
      customCollections: {
        my: FileSystemIconLoader(path.resolve('src', 'assets')),
      },
    }),
    components({
      dts: true,
      allowOverrides: true,
      dirs: [path.resolve('src')],

      /**
       * Hack to fix:
       * https://github.com/anime-skip/web-extension/issues/169
       */
      importPathTransform: path => {
        return path.startsWith('C:') ? path.replaceAll('\\', '\\\\') : path;
      },
      resolvers: [
        IconResolver({
          customCollections: ['my'],
        }),
      ],
    }),
    vue(),
  ],
  build: {
    sourcemap: true,
  },
  optimizeDeps: {
    include: ['vue', '@vueuse/core'],
    // exclude: ['vue-demi'],
  },
});
