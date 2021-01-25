<template>
  <view class="audio">
    <slot name="audio">
      <view class="audio__item" v-for="(item, index) in copyData" :key="index">
        <view
          class="audio__item--left"
          :style="{ 'background-image': 'url(' + item.cover + ')' }"
          @tap="play(index)"
        >
          <view
            :class="[
              'audio__item-icon',
              item.pasued === false ? 'audio__item-icon--animation' : '',
            ]"
          >
            <view
              v-for="(val, index) of 5"
              :key="index"
              class="audio__item-icon__item"
            ></view>
          </view>
        </view>
        <view class="audio__item--right">
          <text class="title">{{ item.filename || "音频" }}</text>
          <view class="progress-box">
            <view style="width: 100%;">
              <slider
                :value="item.value || 0"
                block-size="5"
                activeColor="#52adff"
                backgroundColor="#ddd"
                block-color="#52adff"
                @change="sliderChange($event, index)"
                style="margin: 0;"
              ></slider>
            </view>
          </view>
          <view class="time-line">
            <text class="time">
              {{ item.currentTime || "00:00" }}
            </text>
            <text class="time">
              {{ item.durationTime }}
            </text>
          </view>
        </view>
      </view>
    </slot>
  </view>
</template>

<script>
export default {
  name: "audioList",
  props: {
    audioData: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      audioObj: "",
      audioInfo: [],
      stop: true,
      pasued: true,
    };
  },
  created() {
    this.init();
  },
  computed: {
    copyData() {
      return this.audioData.map((item) => {
        item.durationTime = this.format(item.duration);
        return item;
      });
    },
  },
  methods: {
    // 初始化mp3
    init() {
      if (this.audioObj !== "") {
        this.destroyAudioObj();
      }
      this.audioObj = uni.createInnerAudioContext();
      return this.audioObj;
    },
    // 设置当前播放音频
    setAudioInfo(index) {
      this.audioObj.src = this.copyData[index].audio_path;

      this.audioObj.onPlay(() => {
        this.audioPlay(this.copyData[index]);
      });

      this.audioObj.onPause(() => {
        this.audioPasued(this.copyData[index]);
      });

      this.audioObj.onStop(() => {
        this.audioStop(this.copyData[index]);
      });

      this.audioObj.onEnded(() => {
        this.audioStop(this.copyData[index]);
      });

      this.audioObj.onTimeUpdate(() => {
        this.copyData[index].currentTime = this.format(
          this.audioObj.currentTime
        );
        if (!this.copyData[index].duration)
          this.copyData[index].durationTime = this.format(
            this.audioObj.duration
          );
        let progress =
          (this.audioObj.currentTime / this.audioObj.duration) * 100;
        this.copyData[index].value = parseInt(progress);
      });

      this.audioObj.onSeeked(() => {
        this.copyData[index].currentTime = this.format(
          this.audioObj.currentTime
        );
      });
    },
    //格式化时长
    format(num) {
      let time = "00:00";
      if (num) {
        time =
          "0".repeat(2 - String(Math.floor(num / 60)).length) +
          Math.floor(num / 60) +
          ":" +
          "0".repeat(2 - String(Math.floor(num % 60)).length) +
          Math.floor(num % 60);
      }
      return time;
    },
    sliderChange(e, index) {
      let endTime =
        (parseInt(e.detail.value) / 100) * this.copyData[index].duration;
      this.copyData[index].value = e.detail.value;
      this.seekProgress(endTime);
    },
    play(index) {
      if (this.stop) {
        this.setAudioInfo(index);
        this.audioObj.play();
      } else if (this.pasued) {
        this.audioObj.play();
      } else {
        this.audioObj.pause();
      }
    },
    audioPlay(audio) {
      audio.stop = false;
      audio.pasued = false;
      this.stop = false;
      this.pasued = false;
    },
    audioPasued(audio) {
      audio.pasued = true;
      this.pasued = true;
    },
    audioStop(audio) {
      audio.stop = true;
      audio.pasued = true;
      this.stop = true;
      this.pasued = true;
      audio.currentTime = this.format(0);
      audio.value = 0;
    },
    seekProgress(endTime) {
      this.audioObj.seek(endTime);
    },
    destroyAudioObj() {
      this.audioObj.destroy();
    },
  },
  destroyed() {
    this.destroyAudioObj();
  },
};
</script>

<style lang="scss" scoped>
.audio {
  display: flex;
  flex-flow: column;
  width: 750rpx;
}

.audio__item {
  background: #f5f5f5;
  padding: 16rpx 30rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.audio__item--left {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  height: 120rpx;
  width: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.audio__item-icon {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  width: 58rpx;
  float: left;

  &__item {
    width: 6rpx;
    height: 16rpx;
    display: block;
    background: #fff;

    &:nth-child(2n) {
      height: 32rpx;
    }

    &:nth-child(3) {
      height: 48rpx;
    }
  }
}

.audio__item-icon--animation {
  .audio__item-icon__item {
    -webkit-animation: grow 1s 0s ease-in-out infinite;
    -o-animation: grow 1s 0s ease-in-out infinite;
    animation: grow 1s 0s ease-in-out infinite;

    &:nth-child(2) {
      -webkit-animation: middle-grow 1.2s 0.45s ease-in-out infinite;
      -o-animation: middle-grow 1.2s 0.45s ease-in-out infinite;
      animation: middle-grow 1.2s 0.45s ease-in-out infinite;
    }

    &:nth-child(3) {
      -webkit-animation: last-grow 1s 0.65s ease-in-out infinite;
      -o-animation: last-grow 1s 0.65s ease-in-out infinite;
      animation: last-grow 1s 0.65s ease-in-out infinite;
    }

    &:nth-child(4) {
      -webkit-animation: middle-grow 1.2s 0.85s ease-in-out infinite;
      -o-animation: middle-grow 1.2s 0.85s ease-in-out infinite;
      animation: middle-grow 1.2s 0.85s ease-in-out infinite;
    }
  }
}

.audio__item--right {
  display: flex;
  flex-flow: column;
  flex: 1;
  padding-left: 30rpx;
  line-height: 1.8;
  justify-content: space-around;

  .title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.8;
  }
  .progress-box {
    display: flex;
  }

  .time-line {
    display: flex;
    justify-content: space-between;

    .time {
      color: #999999;
      font-size: 18rpx;
    }
  }
}

@keyframes grow {
  0%,
  100% {
    -webkit-transform: scaleY(1);
    -moz-transform: scaleY(1);
    -ms-transform: scaleY(1);
    -o-transform: scaleY(1);
    transform: scaleY(1);
  }

  50% {
    -webkit-transform: scaleY(3);
    -moz-transform: scaleY(3);
    -ms-transform: scaleY(3);
    -o-transform: scaleY(3);
    transform: scaleY(3);
  }
}

@keyframes middle-grow {
  0%,
  100% {
    -webkit-transform: scaleY(1);
    -moz-transform: scaleY(1);
    -ms-transform: scaleY(1);
    -o-transform: scaleY(1);
    transform: scaleY(1);
  }
  25%,
  75% {
    -webkit-transform: scaleY(1.5);
    -moz-transform: scaleY(1.5);
    -ms-transform: scaleY(1.5);
    -o-transform: scaleY(1.5);
    transform: scaleY(1.5);
  }
  50% {
    -webkit-transform: scaleY(0.5);
    -moz-transform: scaleY(0.5);
    -ms-transform: scaleY(0.5);
    -o-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
}
@keyframes last-grow {
  0%,
  100% {
    -webkit-transform: scaleY(1);
    -moz-transform: scaleY(1);
    -ms-transform: scaleY(1);
    -o-transform: scaleY(1);
    transform: scaleY(1);
  }

  50% {
    -webkit-transform: scaleY(0.3);
    -moz-transform: scaleY(0.3);
    -ms-transform: scaleY(0.3);
    -o-transform: scaleY(0.3);
    transform: scaleY(0.3);
  }
}
</style>
