<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app';
import { getCookie } from './commons/utils/caches';
import { initAPPData } from './commons/utils/loginGetInfo';
import { mode } from '@/commons/config';
const { setUserInfoAttr, getInfo, setClientInfo, setUserAgent, resetUserData } = useStore('user');
let isAppLogin = false;
// 当 uni-app 初始化完成时触发（全局只触发一次），参数为应用启动参数，同 uni.getLaunchOptionsSync 的返回值
onLaunch((_options) => {
  // 如果是从app登录进入的 则isAppLogin 不走onshow中的initAPPData初始化，因为这个时候_options为null
  uni.$on('uniToNatLogin', () => {
    isAppLogin = true;
  });
});

// 当 uni-app 启动，或从后台进入前台显示时触发，参数为应用启动参数，同 uni.getLaunchOptionsSync 的返回值
onShow((_options) => {
  try {
    isAppLogin || initAPPData(_options, 1);
  } catch (e) {
    console.error('onShow声明周期报错----', e);
  }
  isAppLogin = false;
  // #ifdef APP-PLUS
  uni.onNativeEventReceive((event: string, data: any) => {
    uni.$emit(event, data);
  });
  // #endif

  // #ifdef H5
  if (mode.startsWith('dev')) {
    const ckWid = getCookie('XXT_ID');
    if (ckWid != null) {
      // 已登录时
      getInfo({}, 'H5').then(() => {
        const userAgent4Dev = 'android-jxq;hostId:1;appversion:7.0.2;appversioncode:702'; // Android 河南校讯通
        const clientInfo4Dev = {
          cv: '', // 客户端版本号
          chv: '', // 客户端渠道版本号
          ch: '', // 客户端渠道号
          jv: '' // 客户端版本号
        };
        setUserAgent(userAgent4Dev);
        setClientInfo(clientInfo4Dev);
        setUserInfoAttr('phaseCode', 311); // 学段编码
      });
    } else {
      // 未登录时
      resetUserData();
    }
  }
  // #endif
});

// 当 uni-app 从前台进入后台时触发
onHide(() => {});
</script>

<style lang="scss">
/* @import './static/css/xxt-fonts/iconfont.css'; */
/* @import './static/style/thorui-extend.css'; */
</style>
