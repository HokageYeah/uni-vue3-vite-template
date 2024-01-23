import { initAPPData } from './loginGetInfo';
import { uniToNatLogin } from '@/commons/utils/uniToNavProtocol';
function sendNativeEvent(event: string, msg: string | Object) {
  return new Promise((resolve) => {
    // 向宿主App发送事件
    uni.sendNativeEvent(event, msg, (ret: any) => {
      // this.nativeMsg = `宿主App回传的数据：${ret}`;
      resolve(ret);
    });
  });
}

function receiveNativeEvent(eventName: string) {
  return new Promise((resolve) => {
    uni.onNativeEventReceive((event: string, data: any) => {
      if (event === eventName) {
        resolve(data);
      }
    });
  });
}

function login(url: string) {
  sendNativeEvent(uniToNatLogin, url).then((res: any) => {
    uni.$emit('uniToNatLogin', '我是登录成功后的回调到applunch');
    // setTimeout(() => {
    initAPPData(
      {
        referrerInfo: {
          extraData: res
        }
      },
      2
    );
    // }, 4000);
  });
}

export default {
  sendNativeEvent,
  receiveNativeEvent,
  login
};
