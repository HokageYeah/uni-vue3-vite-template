import { resolve } from 'node:path';
import type { ConfigEnv, UserConfigExport } from 'vite';
import { defineConfig, loadEnv } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import TransformPages from 'uni-read-pages-vite';
import AutoImportTypes from 'auto-import-types';
import AutoImport from 'unplugin-auto-import/vite';
import Unocss from 'unocss/vite';
import PiniaAutoRefs from 'pinia-auto-refs';
import postcssPx2rpx from 'postcss-px2rpx';
import { wrapperEnv } from './build/utils';
import { createProxy } from './build/vite/proxy';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  // console.log(`command: ${command}, mode: ${mode}`);
  const root = process.cwd();
  const env = loadEnv(mode, root);
  // console.log('vite----env----', env);
  // 格式化配置项
  const viteEnv = wrapperEnv(env);
  const { VITE_PUBLIC_PATH, VITE_DROP_CONSOLE, VITE_PORT, VITE_GLOB_PROD_MOCK, VITE_PROXY } =
    viteEnv;
  // console.log('vite----viteEnv----', viteEnv);
  // // console.log('vite----env----', env);np
  // console.log('vite----command----', command);

  return defineConfig({
    base: VITE_PUBLIC_PATH,
    esbuild: {},
    resolve: {
      alias: [
        {
          find: /\/#\//,
          replacement: `${pathResolve('types')}/`
        },
        {
          find: '@',
          replacement: `${pathResolve('src')}/`
        }
      ]
    },
    plugins: [
      uni(),
      {
        name: 'test',
        configResolved(config) {
          // console.log('config.resolve.alias查看----', config.resolve.alias);
        }
      },
      AutoImportTypes(),
      AutoImport({
        dts: 'src/auto-imports.d.ts',
        imports: [
          'vue',
          'uni-app',
          'pinia',
          {
            from: 'uni-mini-router',
            imports: ['createRouter', 'useRouter', 'useRoute']
          },
          {
            '@/commons/helper/pinia-auto-refs': ['useStore']
          }
        ],
        exclude: ['createApp'],
        eslintrc: {
          enabled: true,
          globalsPropValue: true
        }
      }),
      Unocss(),
      PiniaAutoRefs({
        storeDir: 'src/commons/store',
        excludes: ['index'],
        outputFile: 'src/commons/helper/pinia-auto-refs.ts'
      })
    ],
    css: {
      postcss: {
        plugins: [
          postcssPx2rpx({
            // 设计稿宽度，默认750
            designWidth: 750,
            // 需要转换的最小像素值，默认1px
            minPixelValue: 1,
            // 转换的精度，默认5
            decimalPlaces: 5
          })
        ] // 这里添加px2rpx插件，就可以在项目中使用px了，而且px2rpx插件会自动转换
      }
    },
    define: {
      ROUTES: new TransformPages().routes // 注入路由表
    },
    server: {
      // 本地开发环境通过代理实现跨域，生产环境使用 nginx 转发
      // base: VITE_PUBLIC_PATH, // 生产环境路径
      host: true,
      port: VITE_PORT, // 端口号
      proxy: createProxy(VITE_PROXY)
    }
    // ,
    // build: {
    //   target: 'es2015',
    //   outDir: 'build',
    //   terserOptions: {
    //     compress: {
    //       keep_infinity: true,
    //       drop_console: VITE_DROP_CONSOLE
    //     }
    //   },
    //   // brotliSize: false,
    //   chunkSizeWarningLimit: 2000
    // }
  });
};
