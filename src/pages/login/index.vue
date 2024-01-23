<template>
  <view>
    <view class="list-cell">
      <form @submit="formSubmit">
        <view class="uni-form-item uni-column">
          <view class="uni-column-title">输入姓名：</view>
          <input class="uni-input" name="input" placeholder="这是一个输入框" />
        </view>
        <view class="uni-form-item uni-column">
          <view class="uni-column-title">性别：</view>
          <radio-group name="radio">
            <label class="radio-label-item"> <radio value="男" /><text>男</text> </label>
            <label class="radio-label-item"> <radio value="女" /><text>女</text> </label>
          </radio-group>
        </view>
        <view v-show="nativeMsg.length !== 0" class="uni-form-item uni-column">
          {{ nativeMsg }}
        </view>
        <view v-show="nativeToMsg.length !== 0" class="uni-form-item uni-column">
          {{ nativeToMsg }}
        </view>
        <view class="uni-btn-v">
          <button form-type="submit" type="button" class="mini-btn list-cell-center" size="mini">
            向宿主App发送事件
          </button>
        </view>
        <view class="uni-btn-v">
          <button type="button" class="mini-btn list-cell-center" size="mini" @click="requestLogin">
            测试登录后接口请求
          </button>
          <button
            type="button"
            class="mini-btn list-cell-center"
            size="mini"
            @click="
              addSSID(
                'NTKF_T2D_CLIENTID=guestA91DF317-A021-C84E-06D2-CCC4B0FECA3C; xxtSessionId=fcc555fdc285ee6db4d063cf2cf742eea562ab4b; XXT_ID=2319877; _XXT_ID=2319877; nTalk_CACHE_DATA={uid:kf_9115_ISME9754_guestA91DF317-A021-C8,tid:1705624487018691}; _LOGIN_MA_=%2df%2df%23jut%2d0%23ma%2dt%23lw%2d59999990%2c2319877%23rce%2df; JSESSIONID=9627ba709f5f2cde1d2242eab94b4780cc74e5b6; XXT_TICKET=9627ba709f5f2cde1d2242eab94b4780cc74e5b6; _XSID_=9627ba709f5f2cde1d2242eab94b4780cc74e5b6; _SSID_=9627ba709f5f2cde1d2242eab94b4780cc74e5b6'
              )
            "
          >
            添加登录信息Cookies
          </button>
          <button
            type="button"
            class="mini-btn list-cell-center"
            size="mini"
            @click="clearLoginInfo"
          >
            清空用户登录信息
          </button>
        </view>
        <view class="uni-btn-v">
          <!-- <text style="width: 50%"
            >用户信息：{{
              userInfo.nickname
                ? `nickname：${userInfo.nickname} - provinceId：${userInfo.provinceId} - schoolName：${userInfo.schoolName} - schoolId：${userInfo.schoolId} - orgId：${userInfo.orgId}`
                : ''
            }}</text
          > -->
          <text class="uni-btn-v-text" style="width: 50%"
            >用户信息：{{ JSON.stringify(userInfo) }}</text
          >
          <text class="uni-btn-v-text" style="width: 50%">接口请求：{{ httpresult }}</text>
        </view>
      </form>
    </view>
    <xxt-file-submit />

    <view class="list-cell">
      <button type="button" class="mini-btn list-cell-center" size="mini" @click="getFileData">
        点击获取附件信息
      </button>
      <button
        type="button"
        class="mini-btn list-cell-center"
        size="mini"
        @click="clickFileUploadApp"
      >
        点击按钮附件上传（原生）
      </button>
      <button
        type="button"
        class="mini-btn list-cell-center"
        size="mini"
        @click="clickFileUploadUni"
      >
        点击按钮附件上传（uni）
      </button>
    </view>
    <view class="list-cell">
      <XXTImgList
        v-show="imageAryData!.length !== 0"
        v-model:image-list="imageAryData"
        :is-show-delete="false"
        :is-editing="true"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import XXTImgList from '@/components/xxt-components/xxt-file-submit/xxt-img-list.vue';
import type { imageObjType } from '@/components/xxt-components/xxt-file-submit/xxtFileType';
const nativeMsg = ref('');
const nativeToMsg = ref('');
const httpresult = ref('');
const { setToken, userInfo, resetUserData } = useStore('user');
const router = useRouter();

const imageAryData = ref<imageObjType[]>([
  {
    path: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2Facbc8e3d-9e34-43b8-933c-875d088c6ac8%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1706169888&t=3dd7fb7fb343d450bc5c18f33893d0e5',
    bigImageUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2Facbc8e3d-9e34-43b8-933c-875d088c6ac8%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1706169888&t=3dd7fb7fb343d450bc5c18f33893d0e5',
    isNetwork: true,
    fileId: '1'
  }
]);

const addSSID = (cookie: string) => {
  setToken(cookie);
};
const formSubmit = (e: any) => {
  const formDetail = JSON.stringify(e.detail.value);
  // #ifdef APP-PLUS || APP-PLUS
  uni.sendNativeEvent(
    'unimp-event',
    {
      msg: formDetail
    },
    (ret: any) => {
      nativeMsg.value = `宿主App回传的数据：${ret}`;
    }
  );
  // #endif

  // #ifndef  APP || APP-PLUS
  uni.showToast({
    title: '此功能只对app端',
    icon: 'error',
    mask: true
  });
  // #endif
};
// #ifdef APP-PLUS || APP-PLUS
uni.onNativeEventReceive((event: any, data: any) => {
  nativeToMsg.value = `接收到宿主App消息 event：${event} data: ${data}`;
  addSSID(data);
  uni.showToast({
    title: nativeToMsg.value,
    icon: 'none',
    mask: true
  });
});
// #endif

const instance = getCurrentInstance();
const requestLogin = () => {
  instance?.proxy
    ?.$uniAjax({
      // url: 'demo/:yy',
      url: '/reading/study/get-user-works',
      data: { pageSize: 1, pageCurrent: 1 },
      method: 'POST',
      custom: {
        auth: true
      }
      // header: {
      //   'custom-header': 'hello' // 自定义请求头信息
      // }
    })
    .then((res: any) => {
      httpresult.value = res;
    });
};
const clearLoginInfo = () => {
  resetUserData();
};
const { imageAry, videoAry, fileAry, audioAry, uploadAllFilesApp, uploadAllFilesUni }: any =
  useStore('fileUpload');
const getFileData = () => {};

const clickFileUploadApp = () => {
  uploadAllFilesApp();
};
const clickFileUploadUni = () => {
  uploadAllFilesUni();
};
</script>

<style scoped lang="scss">
.list-cell {
  margin: 10px;
  padding: 10px;
  background-color: aquamarine;
  vertical-align: baseline;
  /* text-align: center; */
  &-text {
    background-color: red;
  }
  .uni-btn-v {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    &-text {
      overflow: auto;
      word-wrap: break-word;
    }
  }
  &-center {
    margin-left: auto;
    margin-right: auto;
  }
  .uni-column {
    display: flex;
    flex-direction: row;
    // justify-content: start;
    align-items: center;
    margin-bottom: 20px;
    &-title {
      width: 80px;
      text-align: right;
    }
    .radio {
      vertical-align: middle;
      &1 {
        margin-right: 10px;
      }
    }
    .radio-label-item {
      margin-right: 20px;
    }
    .uni-input {
      flex: 1;
      /* 内间距 */
      padding: 5px;
      /* border: 1px solid gray; */
      /* 圆角 */
      border-radius: 4px;
      background-color: azure;
    }
  }
}
</style>
