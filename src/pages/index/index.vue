<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" />
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
    <button @click="goTaskList">去作业列表页</button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const title = ref('Hello');
interface testtype {
  a: number;
  [key: string]: any;
}
const haha = 12;
const a1 = '10';
const props: testtype = {
  a: 1,
  b: 12
};
const router = useRouter();

const goTaskList = () => {
  router.replace({
    path: 'pages/task-list-home/task-list-home'
  });
};
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.logo {
  margin-left: auto;
  margin-right: auto;
  margin-top: 200rpx;
  margin-bottom: 50rpx;
  width: 200rpx;
  height: 200rpx;
}
.text-area {
  display: flex;
  justify-content: center;
}
.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
