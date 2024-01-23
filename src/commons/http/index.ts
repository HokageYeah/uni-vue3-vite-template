// 引入 uni-ajax 模块
import ajax from 'uni-ajax';
import { ContentTypeEnum, RequestEnum } from '@/commons/http/httpEnum';
import {
  apiBaseUrl,
  apiUrlPrefix,
  clickBaseUrl,
  clickUrlPrefix,
  versionCode
} from '@/commons/config/';

const options = {
  // 显示操作成功消息 默认不显示
  showSuccess: false,
  // 成功提醒 默认使用后端返回值
  successMsg: '',
  // 显示失败消息 默认显示
  showError: true,
  // 失败提醒 默认使用后端返回信息
  errorMsg: '',
  // 显示请求时loading模态框 默认显示
  showLoading: true,
  // loading提醒文字
  loadingMsg: '加载中',
  // 需要授权才能请求 默认放开
  auth: false
  // ...
};
type Optional<T> = {
  [k in keyof T]?: T[k];
};
type optionsType = Optional<typeof options>;

declare module 'uni-ajax' {
  interface CustomConfig {
    // prop?: type
    custom?: optionsType;
  }
}

// Loading全局实例
const LoadingInstance = {
  target: null,
  count: 0
};

/**
 * 关闭loading
 */
function closeLoading() {
  if (LoadingInstance.count > 0) LoadingInstance.count--;
  if (LoadingInstance.count === 0) uni.hideLoading();
}

// 自定义请求头信息
const userAgentPrefix = `task-center-${versionCode}`; // UA 前缀部分，不能定制全部。注：仅 APP-PLUS 可定制
const referer = `${userAgentPrefix}.xxt.cn`; // 请求来源。注：仅 APP-PLUS 可定制

// 创建请求实例
const instance = ajax.create({
  // 初始配置
  baseURL: '',
  timeout: 10000,
  method: RequestEnum.GET,
  header: {
    // #ifdef APP-PLUS
    // 设置 UA。注：只能设置前缀
    Referer: referer,
    'User-Agent': userAgentPrefix,
    // #endif
    Accept: 'text/json,application/json',
    'Content-Type': ContentTypeEnum.JSON
    // platform: $platform.name
  },
  // #ifdef APP-PLUS
  // 是否验证 ssl 证书。
  sslVerify: false,
  // #endif
  // #ifdef H5
  // 跨域请求时是否携带凭证（cookies） 平台差异：仅 H5 支持（HBuilderX 2.6.15+）
  withCredentials: true,
  // #endif
  // 自定义参数
  custom: options
});

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求前做些什么
    const { isLogin } = useStore('user');

    // 权限验证 登录验证
    if (config?.custom?.auth && !isLogin.value) {
      uni.showToast({
        title: '未登录',
        icon: 'none',
        mask: true
      });
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject();
    }
    if (config.custom?.showLoading) {
      LoadingInstance.count++;
      LoadingInstance.count === 1 &&
        uni.showLoading({
          title: config.custom.loadingMsg,
          mask: true,
          fail: () => {
            uni.hideLoading();
          }
        });
    }

    const _configUrlTemp = `${config.url}`;
    if (config?.url && config?.url?.startsWith(clickUrlPrefix)) {
      // 处理点击日志请求
      // XXX: 实现仍存在问题，当打包为 H5 发布到 test、production 环境时不支持
      // #ifndef H5
      config.url = clickBaseUrl + config.url.replace(clickUrlPrefix, '');
      // #endif
    } else {
      // 处理一般接口请求
      config.url =
        apiBaseUrl +
        (config?.url![0] !== '/'
          ? `${apiUrlPrefix}/${config.url}`
          : `${apiUrlPrefix}${config.url}`);
    }

    const token = uni.getStorageSync('token');
    // if (token) config.header.Cookie = token;
    if (token) {
      // 以下关于 H5 写入 Cookie 的代码暂时注释掉，实现机制有问题
      // 原因：H5 时不需要手动设置 Cookie
      // 本地开发调试 H5 登录过程：
      // 1. 登录：通过 https://login.xxt.cn/test/logincheck2.do 登录测试页登录
      // 2. 访问功能、调试页面：需要使用 xxt.cn 二级域名访问功能，如：http://test.xxt.cn:8001 。提示：需要配置 hosts，把 test.xxt.cn 指向本机 IP
      // 3. 实现机制：由于 test.xxt.cn、login.xxt.cn 同属 xxt.cn 二级域名，可以实现部分 Cookie 共享，接口请求时会自动带上
      // #ifdef H5
      // // 使用分号 ; 分割字符串
      // const cookieArray: string[] = token.split(';');
      // // console.log('H5token----', token);
      // // 创建对象来存储拆分后的键值对
      // const cookies: { [key: string]: string } = {};
      // const cookieSetting = { expires: 3650, path: '/' };
      // cookieArray.forEach(function (cookie: string) {
      //   const parts = cookie.split('=');
      //   const key = parts[0].trim();
      //   const value = parts[1];
      //   Cookies.set(key, value, cookieSetting);
      //   cookies[key] = value;
      // });
      // #endif

      // #ifdef  APP || APP-PLUS || MP-WEIXIN
      config.header.Cookie = token;
      // 下面方法设置setUserAgent iOS可以 安卓设置失败
      // plus.navigator.setUserAgent(`hostId:${userAgent.value.hostId}`);
      // #endif
    }

    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应数据做些什么

    // 自动设置登录令牌
    // if (response.header.authorization || response.header.Authorization) {
    //   uni.setStorageSync('token', response.header.authorization || response.header.Authorization);
    //   $store('user').setToken(response.header.authorization || response.header.Authorization);
    // }
    response.config?.custom?.showLoading && closeLoading();
    if (response.data?.error != null && response.data.error !== 0) {
      if (response.config.custom?.showError) {
        uni.showToast({
          title: response.data.message || '服务器开小差啦,请稍后再试~',
          icon: 'none',
          mask: true
        });
        return Promise.resolve(response.data);
      }
    }
    const res = response.data;
    // 参考 m2 工程
    if (typeof res === 'object' && 'code' in res && 'status' in res) {
      // 登录超时,重新登录
      if (res.status === 401 && res.code === 2) {
        // // console.log(store)
        // store.dispatch('app/fedLogOut').then(() => {
        //   // login()
        //   adapter.login();
        // });
      } else if (res.status === 400) {
        uni.showToast({
          title: '参数异常',
          icon: 'none',
          mask: true
        });
      } else {
        uni.showToast({
          title: res.message || '请求接口时发生异常，请稍后再试',
          icon: 'none',
          mask: true
        });
      }
      return Promise.reject(res);
    }
    if (
      response.data.error === 0 &&
      response.data.msg !== '' &&
      response.config.custom?.showSuccess
    ) {
      uni.showToast({
        title: response.config.custom.successMsg || response.data.msg,
        icon: 'none',
        mask: true
      });
    }
    return Promise.resolve(response.data);
  },
  (error) => {
    // 对响应错误做些什么
    // 登录信息鉴权处理
    // const userStore = $store('user');
    // const isLogin = userStore.isLogin;
    let errorMessage = '网络请求出错';
    if (error !== undefined || error !== null) {
      switch (error.statusCode) {
        case 400:
          errorMessage = '请求错误';
          break;
        case 401:
          // if (isLogin) {
          //   errorMessage = '您的登陆已过期';
          // } else {
          //   errorMessage = '请先登录';
          // }
          // userStore.logout(true);
          // showAuthModal();
          break;
        case 403:
          errorMessage = '拒绝访问';
          break;
        case 404:
          errorMessage = '请求出错';
          break;
        case 408:
          errorMessage = '请求超时';
          break;
        case 429:
          errorMessage = '请求频繁, 请稍后再访问';
          break;
        case 500:
          errorMessage = '服务器开小差啦,请稍后再试~';
          break;
        case 501:
          errorMessage = '服务未实现';
          break;
        case 502:
          errorMessage = '网络错误';
          break;
        case 503:
          errorMessage = '服务不可用';
          break;
        case 504:
          errorMessage = '网络超时';
          break;
        case 505:
          errorMessage = 'HTTP版本不受支持';
          break;
      }
      if (error.errMsg.includes('timeout')) errorMessage = '请求超时';
      if (!error.errMsg.includes('timeout')) errorMessage = error.errMsg;
      // #ifdef H5
      if (error.errMsg.includes('Network'))
        errorMessage = window.navigator.onLine ? '服务器异常' : '请检查您的网络连接';
      // #endif
    }
    if (error && error.config) {
      error.config.custom.showLoading && closeLoading();
      error.config.custom?.showError &&
        uni.showToast({
          title: error.data?.msg || errorMessage,
          icon: 'none',
          mask: true
        });
    }
    return false;
  }
);

// 附件类型：1图片；2语音；3视频；4文件；5链接
const errorStrFunc = (fileTypeNum: number) => {
  let errmsg = '图片';
  switch (fileTypeNum) {
    case 1:
      errmsg = '图片';
      break;
    case 2:
      errmsg = '语音';
      break;
    case 3:
      errmsg = '视频';
      break;
    case 4:
      errmsg = '文件';
      break;
    case 5:
      errmsg = '链接';
      break;
    default:
      break;
  }
  return errmsg;
};

const calculateElapsedTime = (start: any) => {
  const end: any = new Date(); // 记录结束时间
  const elapsedTime = end - start; // 计算时间差值

  // 将时间差值转换为秒数
  const seconds = Math.floor(elapsedTime / 1000);
  console.info('上传附件结束时间---', end);
  console.log('图片上传时间：', seconds, '秒');
};

// 附件上传接口 filePath 上传地址， fileTypeNum上传附件类型  retryCount上传失败重复次数  formData上传参数
// 附件类型：1图片；2语音；3视频；4文件；5链接
const uploadFilePromise = (
  filePath: string,
  fileTypeNum: number,
  retryCount: number,
  formData: any
) => {
  const token = uni.getStorageSync('token');
  const errorStr = errorStrFunc(fileTypeNum);
  const uploadFileAPI = `${apiBaseUrl}${apiUrlPrefix}/zuul/task-center/task-attachment/upload-file`;
  return new Promise<void>((resolve, reject) => {
    // const start = new Date(); // 记录开始时间
    // console.info('开始上传附件时间---', start);
    uni.uploadFile({
      url: uploadFileAPI,
      filePath,
      name: 'file',
      formData,
      timeout: 60000, // 超时时间60s
      header: {
        Cookie: token,
        Referer: referer,
        'User-Agent': userAgentPrefix
      },
      success: (resData: any) => {
        const res = JSON.parse(resData.data);
        // 上传成功的处理逻辑
        // 参考 m2 工程
        if (typeof res === 'object' && 'code' in res && 'status' in res) {
          if (retryCount > 0) {
            retryCount--;
            // 在重试前使用 setTimeout 函数等待一段时间，避免短时间内多次上传导致服务器拒绝请求
            setTimeout(() => {
              uploadFilePromise(filePath, fileTypeNum, retryCount, formData)
                .then(resolve)
                .catch(reject);
            }, 1000);
            return;
          } else {
            // 登录超时,重新登录
            if (res.status === 401 && res.code === 2) {
              // // console.log(store)
              // store.dispatch('app/fedLogOut').then(() => {
              //   // login()
              //   adapter.login();
              // });
            } else if (res.status === 400) {
              uni.showToast({
                title: '参数异常',
                icon: 'none',
                mask: true
              });
            } else {
              uni.showToast({
                title: res.message || '请求接口时发生异常，请稍后再试',
                icon: 'none',
                mask: true
              });
            }
            return reject(res.message);
          }
        }
        // console.log('附件上传成功-----');
        // calculateElapsedTime(start);
        resolve();
      },
      fail: () => {
        console.log('附件上传失败-----');
        // 上传失败的处理逻辑
        if (retryCount > 0) {
          retryCount--;
          // 在重试前使用 setTimeout 函数等待一段时间，避免短时间内多次上传导致服务器拒绝请求
          setTimeout(() => {
            uploadFilePromise(filePath, fileTypeNum, retryCount, formData)
              .then(resolve)
              .catch(reject);
          }, 1000);
        } else {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(`${errorStr}附件上传失败`);
        }
      }
    });
  });
};

const uploadFilesCallBack = 'uploadFilesCallBack';

export default instance;
export { uploadFilePromise, uploadFilesCallBack };
