<template>
  <view class="xxt-audio-player">
    <view class="xxt-audio-player-bg">
      <image
        class="xxt-audio-player-bg-img"
        mode="aspectFill"
        :src="voicePlayStr"
        @click="play"
      ></image>
      <text class="xxt-audio-player-bg-time">{{ formatedPlayTime }}</text>
      <slider
        class="xxt-audio-player-bg-slider"
        :min="0"
        :step="0.1"
        :value="playTime"
        active-color="#4bd975"
        background-color="#e9e9e9"
        :max="recordTime"
        :block-size="8"
        block-color="#4bd975"
        @changing="onchanging"
        @change="onchange"
      ></slider>
      <text class="xxt-audio-player-bg-time">{{ formatedRecordTime }}</text>
    </view>
    <tui-icon
      v-if="isShowDelete"
      class="xxt-audio-player-delete-icon"
      custom-prefix="icon-x-cuowu"
      name="iconfont"
      color="#ec6144"
      :size="16"
      @click="deleteAudio"
    />
  </view>
</template>

<script setup lang="ts">
import type { audioType } from './xxtFileType';
import utils from '@/commons/utils';
import { $cdn } from '@/commons/config';

const props = withDefaults(
  defineProps<{
    recordMucStr: string;
    isShowDelete: boolean;
    recordTime: number;
    audioAry: audioType[];
  }>(),
  {
    recordMucStr: '',
    isShowDelete: true,
    recordTime: 0,
    audioAry: (): audioType[] => {
      return [];
    }
  }
);
const emits = defineEmits<{
  (e: 'deleteAudio', recordMucStr: string): void;
  (e: 'update:audioAry', audioList: audioType[]): void;
}>();
let _audioContext: any;
let _isChanging: boolean;
const playTime = ref(0);
const isvoicePlaying = ref(false);
const isvoicePlayEnd = ref(false);
const duration = ref(0);
// 录制时间
const formatedPlayTime = computed(() => {
  return utils.formatTime(playTime.value);
});
// 播放录音时间
const formatedRecordTime = computed(() => {
  return utils.formatTime(duration.value);
});
const voicePlayStr = computed(() => {
  if (!isvoicePlaying.value) {
    return `${$cdn}/nb/m/uni-task-center/img/record-file-play.png`;
  } else {
    return `${$cdn}/nb/m/uni-task-center/img/record-file-pause.png`;
  }
});
const onchange = (e: any) => {
  _audioContext.seek(e.detail.value);
  _isChanging = false;
};
const onchanging = (e: any) => {
  _isChanging = true;
  playTime.value = Math.floor(e.detail.value);
};

const createAudio = () => {
  const innerAudioContext = (_audioContext = uni.createInnerAudioContext());
  innerAudioContext.autoplay = false;
  innerAudioContext.src = props.recordMucStr;
  innerAudioContext.onPlay(() => {});
  innerAudioContext.onTimeUpdate((e) => {
    if (_isChanging === true) {
      return;
    }
    playTime.value = Math.floor(innerAudioContext.currentTime) || 0;
    duration.value = Math.floor(innerAudioContext.duration) || 0;
  });
  innerAudioContext.onEnded(() => {
    playTime.value = 0;
    isvoicePlaying.value = false;
    isvoicePlayEnd.value = true;
  });
  innerAudioContext.onError((res) => {
    isvoicePlaying.value = false;
  });
  return innerAudioContext;
};
const pause = () => {
  _audioContext.pause();
  isvoicePlaying.value = false;
};
const play = () => {
  if (isvoicePlaying.value) {
    pause();
    return;
  }
  isvoicePlaying.value = true;
  _audioContext.play();
  isvoicePlayEnd.value = false;
};
const stop = () => {
  _audioContext.stop();
  isvoicePlaying.value = false;
};
const deleteAudio = () => {
  // emits('deleteAudio', props.recordMucStr);
  emits(
    'update:audioAry',
    props.audioAry.filter((item) => item.audioPath !== props.recordMucStr) as []
  );
  stop();
};
onLoad(() => {
  _isChanging = false;
  _audioContext = null;
  let luyintime = props.recordTime;
  if (typeof props.recordTime == 'string') {
    luyintime = parseInt(props.recordTime, 10);
  }
  duration.value = luyintime;
  createAudio();
});
onUnload(() => {
  if (_audioContext != null && isvoicePlaying.value) {
    stop();
  }
});
</script>

<style scoped lang="scss">
.xxt-audio-player {
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
    &-time {
      margin-left: 8px;
      font-weight: 400;
      font-size: 12px;
      color: #4ad975;
    }
    &-time:last-of-type {
      margin-left: 5px;
      margin-right: 10px;
    }
    &-slider {
      flex: 1;
      margin-left: 10px;
    }
  }
  &-delete-icon {
    position: absolute;
    right: 10px;
    top: 2px;
  }
}
</style>
