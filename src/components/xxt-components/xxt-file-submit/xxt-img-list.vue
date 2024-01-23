<template>
  <scroll-view class="image-list" :scroll-x="true" scroll-left="120" :show-scrollbar="false">
    <view v-for="(item, index) in imageList" :key="item.path" class="image-list-item">
      <image
        class="image-list-item-img"
        mode="aspectFill"
        :src="item.path"
        lazy-load
        @error="imageError"
        @click="clickImage(index)"
      />
      <tui-icon
        v-if="isShowDelete"
        class="image-list-item-icon"
        custom-prefix="icon-x-cuowu"
        name="iconfont"
        color="#ec6144"
        :size="16"
        @click="deleteImage(index)"
      />
    </view>
    <view
      v-show="imageList.length < maxImgNumber && isShowDelete"
      class="image-list-item"
      @click="selectImg"
    >
      <image class="image-list-item-img image-list-item-add" />
      <!--  #ifndef  MP-WEIXIN -->
      <tui-icon
        class="image-list-item-icon-add"
        custom-prefix="icon-x-add"
        name="iconfont"
        color="#4bd975"
        :size="40"
      />
      <!-- #endif -->
      <!--  #ifdef  MP-WEIXIN -->
      <tui-icon
        class="image-list-item-icon-add"
        custom-prefix="icon-x-add"
        name="iconfont"
        color="#4bd975"
        size="{{40}}"
      />
      <!-- #endif -->
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { uniToNativeImageEditing } from './xxtFileSupportHooks';
import type { imageObjType } from './xxtFileType';
import { isNetworkUrl } from '@/commons/utils/util';
import { uniToAppPluginBridge } from '@/commons/utils/uniToAppPluginBridge';
const props = withDefaults(
  defineProps<{
    imageList: imageObjType[];
    isShowDelete: boolean;
    isPreviewImg?: boolean;
    isEditing?: boolean;
    maxImgNumber?: number;
  }>(),
  {
    imageList: (): imageObjType[] => {
      return [];
    },
    isShowDelete: true,
    isEditing: false,
    isPreviewImg: true,
    maxImgNumber: 9
  }
);
const emits = defineEmits<{
  (e: 'update:imageList', imgList: []): void;
  (e: 'selectImg'): void;
}>();
const imageError = (e: any) => {
  console.error(`image发生error事件，携带值为${e.detail.errMsg}`);
};
const show = ref(false);
const current = ref(0);
const urlsObj = computed(() => {
  return props.imageList.map((item) => ({
    imgPath: item.bigImageUrl?.replace('_s', '') || item.path,
    fileId: item.fileId,
    isNetwork: isNetworkUrl(item.path)
  }));
});
const clickImage = (index: number) => {
  show.value = true;
  current.value = index;
  // uni预览编辑
  // uni.previewImage({
  //   urls: urls.value,
  //   current: current.value
  // });
  if (props.isPreviewImg) {
    const imgUrlList1 = urlsObj.value.filter((item) => item.isNetwork).map((item) => item.imgPath);

    // #ifdef APP-PLUS
    const imgUrlList = urlsObj.value.filter((item) => item.isNetwork).map((item) => item.imgPath);
    // uniToAppPluginBridge.gotoOpenImg({
    //   imgUrlList,
    //   showSave: true,
    //   showEdit: true,
    //   editTitle: '圈画批改',
    //   homeworkCorrect: true,
    //   index: current.value
    // });
    uniToNativeImageEditing({
      imgUrlList,
      showSave: true,
      showEdit: props.isEditing,
      editTitle: '圈画批改',
      homeworkCorrect: true,
      index: current.value
    });
    // #endif
  } else {
    const imgUrlList1 = urlsObj.value.filter((item) => item.isNetwork).map((item) => item.imgPath);
    // app端预览图片
    // #ifdef APP-PLUS
    const httpImgList = urlsObj.value.filter((item) => item.isNetwork);
    uniToAppPluginBridge.gotoPreviewImg({
      selectedList: urlsObj.value,
      maxNum: 9,
      selectableNum: 9 - httpImgList.length,
      index: current.value
    });
    // #endif
  }

  // uniToNativeImageOperate(
  //   uniToNatImagePreview,
  //   urls.value,
  //   9,
  //   9 - urls.value.length,
  //   current.value
  // );
};
const deleteImage = (deIndex: number) => {
  emits('update:imageList', props.imageList.filter((_, index) => index !== deIndex) as []);
};
const selectImg = () => {
  emits('selectImg');
};
</script>

<style scoped lang="scss">
.image-list {
  width: 100%;
  height: 98px;
  /* background-color: aqua; */
  white-space: nowrap;
  &-item {
    display: inline-block;
    position: relative;
    width: 100px;
    height: 100px;
    /* background-color: olive; */
    vertical-align: middle;
    &-img {
      position: absolute;
      left: 50%;
      top: 50%;
      border: 1px solid #4ad975;
      border-radius: 8px;
      width: 77px;
      height: 77px;
      /* background-color: #ddd; */
      transform: translate(-50%, -50%);
    }
    &-add {
      border: 1px dashed #4ad975;
    }
    &-icon-add {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    &-icon {
      position: absolute;
      left: 100%;
      top: 0%;
      transform: translate(-120%, 10%);
    }
  }
}
</style>
