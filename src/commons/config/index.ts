// 配置信息
// 考虑到不同环境的差异性，需通过 uni-app 条件编译才能得到最终配置
// 因此，需要从这里获取最终配置

import manifest from '../../manifest.json';

// 接口域名
let apiBaseUrl = import.meta.env.VITE_GLOB_API_URL;
// 接口前缀
let apiUrlPrefix = import.meta.env.VITE_GLOB_API_URL_PREFIX;

// 点击日志接口域名
let clickBaseUrl = import.meta.env.VITE_GLOB_CLICK_URL;
// 点击日志接口前缀
const clickUrlPrefix = import.meta.env.VITE_GLOB_CLICK_URL_PREFIX;

// 「H5 应用」页面与接口使用的是同一个域名，不需要指定接口域名，但需要指定前缀
// #ifdef H5
apiBaseUrl = '';
clickBaseUrl = '';
// #endif

// 「非 H5 应用」接口使用 API 网关域名，不需要指定接口前缀
// #ifndef H5
apiUrlPrefix = '';
// #endif

// 静态资源 CDN 域名
const $cdn = import.meta.env.VITE_GLOB_IMG_CDN_URL;

// 小程序 versionName
const versionName = manifest.versionName;
// 小程序 versionCode
const versionCode = manifest.versionCode;

// 构建命令中通过 --mode XXX 指定，见 package.json
const mode = import.meta.env.MODE;
// 构建时间。在 build/utils.ts 中指定
const buildTime = import.meta.env.VITE_BUILD_TIME;

export {
  apiBaseUrl, // 接口域名
  apiUrlPrefix, // 接口前缀
  clickBaseUrl, // 点击日志接口域名
  clickUrlPrefix, // 点击日志接口前缀
  $cdn, // 静态资源 CDN 域名
  versionName, // 小程序 versionName
  versionCode, // 小程序 versionCode
  mode, // 编译模式
  buildTime // 代码构建、发布时间
};
