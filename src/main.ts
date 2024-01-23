import type { AjaxConfigType, AjaxInstance } from 'uni-ajax';
import { createSSRApp } from 'vue';
import { setupRouter } from './commons/router';
import App from './App.vue';
import { setupPinia } from './commons/store';
import 'uno.css';
import { $cdn } from './commons/config';
import ajax from '@/commons/http';
import './commons/utils/interceptor';
import globalMixin from '@/commons/mixins/globalMixins';
export function createApp() {
  const app = createSSRApp(App);
  // 注册pinia
  setupPinia(app);
  // 注册路由
  setupRouter(app);
  // 添加全局的mixin混入
  app.mixin(globalMixin);
  // 全局请求实例挂在到实例身上
  app.config.globalProperties.$uniAjax = ajax;
  app.config.globalProperties.$cdn = $cdn;
  return {
    app
  };
}

// 编写ts loading 声明文件放置报错 和 智能提示
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $uniAjax: AjaxInstance<AjaxConfigType>;
    $cdn: string;
  }
}
