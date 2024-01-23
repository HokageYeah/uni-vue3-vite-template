<template>
  <scroll-view :scroll-top="scrollTop" :scroll-y="true" class="scroll-y">
    <view class="list-cell">
      <text class="list-cell-text">scss样式background背景改变</text>
      <br />
      <text class="bg-sky-500">我是tailwind内的样式bg-sky-500</text>
    </view>
    <view class="list-cell">
      <view class="p-30">unocss-test</view>
      <view class="m-l-30">unocss-test2</view>
    </view>
    <view class="list-cell">
      我是详情页面: {{ count }}、{{ insertCount }}
      <button class="mini-btn" size="mini" @click="addCount">点击按钮pinia状态改变</button>
    </view>
    <view class="list-cell">
      <button class="mini-btn" size="mini" @click="goToPage">点击按钮路由跳转</button>
    </view>
    <view class="list-cell">
      <uni-test />
      <xxt-test />
    </view>
    <view class="list-cell">
      <button class="mini-btn list-cell-center" size="mini" @click="requestSend">
        点击按钮发起请求
      </button>
      <view v-for="province in provinceList" :key="province"> {{ province.provinceName }}</view>
    </view>
    <view class="list-cell">
      <button class="mini-btn" size="mini" @click="goToLogin">点击按钮跳转与宿主APP交互页面</button>
    </view>
    <view class="list-cell">
      <button
        class="mini-btn"
        size="mini"
        @click="readResourceSelectH5('&unimpUrl=pages/detail/test')"
      >
        选择课文朗读资源（教师端）通信方式
      </button>
      <button
        class="mini-btn"
        size="mini"
        @click="readResourceSelectH5Plugs('&unimpUrl=pages/detail/test')"
      >
        选择课文朗读资源（教师端）插件方式
      </button>
    </view>
    <view class="list-cell">
      <button
        class="mini-btn"
        size="mini"
        @click="classicReadingResourceSelectH5('&unimpUrl=pages/detail/test')"
      >
        选择经典诵读资源（教师端）通信方式
      </button>
      <button
        class="mini-btn"
        size="mini"
        @click="classicReadingSelectH5Plugs('&unimpUrl=pages/detail/test')"
      >
        选择经典诵读资源（教师端）插件方式
      </button>
    </view>
    <view class="list-cell">
      <button
        class="mini-btn"
        size="mini"
        @click="englishReadingResourceSelectH5('&unimpUrl=pages/detail/test')"
      >
        选择英语读测评资源（教师端）通信方式
      </button>
      <button
        class="mini-btn"
        size="mini"
        @click="englishReadingSelectH5Plugs('&unimpUrl=pages/detail/test')"
      >
        选择英语读测评资源（教师端）插件方式
      </button>
    </view>
    <view class="list-cell">
      <button
        class="mini-btn"
        size="mini"
        @click="mathClassPracticeResourceSelectH5('&unimpUrl=pages/detail/test')"
      >
        选择数学课时练资源（教师端）通信方式
      </button>
      <button
        class="mini-btn"
        size="mini"
        @click="mathClassPracticeResourceSelectH5Plugs('&unimpUrl=pages/detail/test')"
      >
        选择数学课时练资源（教师端）插件方式
      </button>
    </view>
    <view class="list-cell">
      <button
        class="mini-btn"
        size="mini"
        @click="readStudentFinishH5('&unimpUrl=pages/detail/test')"
      >
        完成课文朗读（学生端）通信方式
      </button>
      <button
        class="mini-btn"
        size="mini"
        @click="readStudentFinishH5Plugs('&unimpUrl=pages/detail/test')"
      >
        完成课文朗读（学生端）插件方式
      </button>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { natToUniBridgeToH5 } from '@/commons/utils/uniToNavProtocol';
import {
  classicReadingResourceSelectH5,
  classicReadingSelectH5Plugs,
  englishReadingResourceSelectH5,
  englishReadingSelectH5Plugs,
  mathClassPracticeResourceSelectH5,
  mathClassPracticeResourceSelectH5Plugs,
  readResourceSelectH5,
  readResourceSelectH5Plugs,
  readStudentFinishH5,
  readStudentFinishH5Plugs
} from '@/commons/utils/uniToAppH5Bridge';

// 方法一：
/**
  import testStore from '@/commons/store/modules/test';
  const teststor = testStore();
  const count = computed(() => teststor.count);
  const addCount = () => {
    teststor.increment();
  };
 */

// 方法二：
/**
 import $store from '@/commons/store/index';
 const test = $store('test');
 const count = computed(() => test.count);
  const addCount = () => {
    test.increment();
  };
   */

// 方法三：（推荐）
const router = useRouter();
const { count, increment, insertCount, incrementCount } = useStore('test');
const goToPage = () => {
  router.push({
    name: 'test',
    params: {
      id: '123',
      name: '多久啊啥的'
    }
  });
  // uni.navigateTo({
  //   url: '/pages/detail/test'
  // });
};
const addCount = () => {
  increment();
  incrementCount();
};

// 跳转到登录页面
const goToLogin = () => {
  router.push({
    name: 'login',
    params: {
      id: '222',
      name: '登录页面'
    }
  });
  // uni.navigateTo({
  //   url: '/pages/detail/test'
  // });
};

// 网络请求
const instance = getCurrentInstance();
const scrollTop = ref(0);
const provinceList: Ref<any[]> = ref([]);
const requestSend = () => {
  uni.getNetworkType({
    success(res) {}
  });
  instance?.proxy
    ?.$uniAjax({
      // url: 'demo/:yy',
      url: '/base/region/getprovinces',
      params: { yy: 'text' },
      query: { timestamp: 1590832951672 },
      method: 'GET'
    })
    .then((res: any) => {
      provinceList.value = res;
    });
};
onLoad((options) => {
  uni.$on(natToUniBridgeToH5, (data: any) => {
    const unimpUrl = data.unimpUrl;
    const unimpParams = data.unimpParams;
    router.push({
      path: unimpUrl,
      query: unimpParams
    });
  });
});
</script>

<style scoped lang="scss">
.scroll-y {
  height: auto;
}
.list-cell {
  margin: 10px;
  padding: 10px;
  background-color: aquamarine;
  vertical-align: baseline;
  text-align: center;
  &-text {
    background-color: red;
  }
  &-center {
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
