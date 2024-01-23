<template>
  <view>我是测试页面</view>
</template>

<script setup lang="ts">
onLoad((options) => {
  uni.showToast({
    title: `这是test的-----${JSON.stringify(options)}`,
    duration: 3000,
    icon: 'none'
  });
});
</script>

<style scoped></style>
