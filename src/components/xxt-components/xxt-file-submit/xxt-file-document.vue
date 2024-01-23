<template>
  <view class="xxt-file-document">
    <view class="xxt-file-document-bg" @click="linkClick">
      <image class="xxt-file-document-bg-img" mode="aspectFill" :src="fileImgSrc"></image>
      <xxt-text-overflow class="xxt-file-document-bg-text" :text="fileName" :clamp="2" />
    </view>
    <!--  #ifndef  MP-WEIXIN -->
    <tui-icon
      v-if="isShowDelete"
      class="xxt-file-document-delete-icon"
      custom-prefix="icon-x-cuowu"
      name="iconfont"
      color="#ec6144"
      :size="16"
      @click="deleteFile"
    />
    <!-- #endif -->
    <!--  #ifdef  MP-WEIXIN -->
    <tui-icon
      v-if="isShowDelete"
      class="xxt-file-document-delete-icon"
      custom-prefix="icon-x-cuowu"
      name="iconfont"
      color="#ec6144"
      size="{{16}}"
      @click="deleteFile"
    />
    <!-- #endif -->
  </view>
</template>

<script setup lang="ts">
import type { fileType } from './xxtFileType';
import { uniToAppPluginBridge } from '@/commons/utils/uniToAppPluginBridge';
import { $cdn } from '@/commons/config';
// filetype: 0 是链接。 1 是docx、 2 pdf、 3 ppt、 4 txt
const props = withDefaults(
  defineProps<{
    fileTypeNum: number;
    isShowDelete?: boolean;
    fileName: string;
    linkAddressStr: string;
    fileID: string;
    fileAry: fileType[];
  }>(),
  {
    fileTypeNum: 0,
    isShowDelete: true,
    fileName: '',
    linkAddressStr: '',
    fileID: '',
    fileAry: (): fileType[] => {
      return [];
    }
  }
);
const emits = defineEmits<{
  (e: 'update:fileAry', audioList: fileType[]): void;
}>();
const getExtension = (filename: string) => {
  const dotIndex = filename.lastIndexOf('.');
  if (dotIndex !== -1) {
    return filename.substring(dotIndex + 1);
  }
  return 'word';
};
const getFileImage = (ext: string) => {
  let extstr = 'word';
  switch (ext) {
    case 'doc':
    case 'docx':
    case 'dot':
    case 'dotx':
      extstr = 'word';
      break;
    case 'xls':
    case 'xlsx':
      extstr = 'excel';
      break;
    case 'ppt':
    case 'pptx':
      extstr = 'ppt';
      break;
    case 'pdf':
      extstr = 'pdf';
      break;
    case 'mp3':
    case 'wav':
    case 'aac':
    case 'm4a':
    case 'mp4':
      extstr = 'music';
      break;
    case 'zip':
      extstr = 'file';
      break;
    case 'rar':
      extstr = 'file';
      break;
    case 'txt':
      extstr = 'txt';
      break;
    default:
      break;
  }
  return extstr;
};
// filetype: 0 是链接。 1 是docx、 2 pdf、 3 ppt、 4 txt
const fileImgSrc = computed(() => {
  switch (props.fileTypeNum) {
    case 0:
      return `${$cdn}/nb/m/uni-task-center/img/ic_link.png`;
    default: {
      const imgname = getFileImage(getExtension(props.linkAddressStr));
      return `${$cdn}/nb/m/uni-task-center/img/ic_${imgname}.png`;
    }
  }
});
const router = useRouter();
const deleteFile = () => {
  emits('update:fileAry', props.fileAry.filter((item) => item.fileID !== props.fileID) as []);
};
const linkClick = () => {
  switch (props.fileTypeNum) {
    case 0:
      router.push({
        name: 'webView',
        params: {
          url: props.linkAddressStr
        }
      });
      break;
    default:
      // app端预览文件
      // #ifdef APP-PLUS
      uniToAppPluginBridge.gotoOpenFile({
        fileId: props.fileID,
        filePath: props.linkAddressStr,
        fileName: props.fileName
      });
      // #endif
      break;
  }
};
</script>

<style scoped lang="scss">
.xxt-file-document {
  position: relative;
  padding: 8px 16px;
  &-bg {
    @include normalFlex(row, start);
    padding: 0 10px;
    border-radius: 8px;
    height: 40px;
    background-color: #f9f9f9;
    &-img {
      width: 30px;
      height: 30px;
    }
    &-text {
      flex: 1;
      margin-left: 10px;
      color: #4bd975;
    }
  }
  &-delete-icon {
    position: absolute;
    right: 10px;
    top: 2px;
  }
}
</style>
