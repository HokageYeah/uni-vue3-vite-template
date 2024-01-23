<template>
  <view class="icon-btn-bg" @click="iconClick">
    <!--  #ifndef  MP-WEIXIN -->
    <tui-icon :custom-prefix="iconObj.icon" name="iconfont" size="26"></tui-icon>
    <tui-text :text="iconObj.name" size="26" align="center" color="#999999"></tui-text>
    <!-- #endif -->
    <!--  #ifdef  MP-WEIXIN -->
    <tui-icon custom-prefix="{{iconObj.icon}}" name="iconfont" size="{{26}}"></tui-icon>
    <tui-text text="{{iconObj.name}}" size="26" align="center" color="#999999"></tui-text>
    <!-- #endif -->
  </view>
</template>

<script setup lang="ts">
import type { iconType } from './xxtFileType';

const props = withDefaults(
  defineProps<{
    iconObj: iconType;
  }>(),
  {
    iconObj: (): iconType => {
      return {
        name: '',
        type: 0,
        icon: ''
      };
    }
  }
);
// TS写法
const emits = defineEmits<{
  (e: 'iconClick', selectIcon: number): void;
}>();
const iconClick = () => {
  emits('iconClick', props.iconObj.type);
};
</script>

<style scoped lang="scss">
.icon-btn-bg {
  width: 50px;
  height: 50px;
  /* background-color: sienna; */
  @include normalFlex(column);
}
</style>
