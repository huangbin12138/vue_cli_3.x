<template>
  <div class="player por ovh csp" :class="{'full-screen-box': isFullScreen}"
       @mousemove="showControls"
       @mouseleave="showCtr = false">
    <video-player class="video-player vjs-custom-skin"
                  ref="videoPlayer"
                  :playsinline="true"
                  :options="playerOptions"
                  @ready="onPlayerReady"
                  @loadeddata="onPlayerLoadedData"
                  @play="onPlayerPlay"
                  @playing="onPlayerPlaying"
                  @timeupdate="onPlayerTimeUpdate"
                  @pause="onPlayerPause"
                  @ended="onPlayerEnded">
    </video-player>

    <!-- 自定义播放控件 -->
    <div class="bg-play poa w100 h100 l0 t0 csp zi-1" @click="play">
      <div class="big-play-btn abs-mc"></div>
    </div>
    <div class="poa l0 b0 my-play-controls w100 zi-2">
      <div class="my-bottom-controls w100 por flex jcb"
           :class="{'show-controls': showCtr}"
           ref="myBottomControls"
           @click="setCurrentTime">
        <div class="poa current-time-line l0" :style="{width: currentTime / duration * 100 + '%'}">
          <div class="poa circle r0 t0"></div>
        </div>
        <div :class="key + '-controls'" class="flex jcb" v-for="(control, key) in controls" :key="key">
          <template v-for="(item, i) in control">
            <slot :name="item.slot" :config="item">
              <div class="play-btn csp" @click="play"
                   :class="playing ? 'playing' : 'el-icon-caret-right'"
                   v-if="item.type === 'play-btn'"></div>
              <div class="times" v-else-if="item.type === 'time'">
                {{currentTime | formatTime(duration, surplus, item.value, player)}}
              </div>
              <div class="voice csp" v-else-if="item.type === 'voice'">
                <!--<img src="../images/voice_ico_03.png" alt="" class="vam voice-img">-->
                <div class="voice-line vam dib por ovh" ref="volumeBox" @click="setVolume">
                  <div class="poa line-inner h100" :style="{width: volume * 100 + '%'}"></div>
                </div>
              </div>
              <div class="por tac csp select" v-else-if="item.type === 'list-btn'">
                {{item.value}}
                <ul class="poa t0 select-box w100 transition">
                  <li class="select-item" :class="{active: text === item.value}"
                      @click="optionsCallback(item, text, $event)"
                      v-for="text in item.options"
                      :key="text">{{text}}
                  </li>
                </ul>
              </div>
              <div class="full-screen el-icon-full-screen csp" @click="fullScreen"
                   v-else-if="item.type = 'full-btn'"></div>
            </slot>
          </template>
        </div>
      </div>
    </div>
    <div class="un-hover pof w100 h100 l0 t0 zi-10" :class="{dn: !unHover}"></div>
  </div>
</template>

<script>
  import 'video.js/dist/video-js.css';
  import {videoPlayer, videojs} from 'vue-video-player';
  import 'videojs-contrib-hls';
  import util from '@/mixins/tools';

  export default {
    name: 'MyPlayer',
    props: {
      videoSrc: { // 播放链接
        type: String,
        default: ''
      },
      poster: { // 播放海报
        type: String,
        default: ''
      },
      aspect: { // 播放器尺寸
        type: String,
        default: '16:9'
      },
      type: { // 播放器类型
        type: String,
        default: '', // live
      },
      options: {
        type: Object,
        default() {
          return {};
        }
      },
    },
    filters: {
      // 格式化时间
      formatTime(curr, duration, surplus, format, player) {
        return format.replace('$c', util.numberToTime(curr * 1000))
          .replace('$d', util.numberToTime(duration * 1000))
          .replace('$s', util.numberToTime(surplus * 1000));
      },
    },
    data() {
      return {
        // 点击list-btn时失去焦点，使list自动收回
        unHover: false,
        // 是否正在播放
        playing: false,
        // 自定义控件配置
        controls: {
          left: [
            // 播放按钮
            {type: 'play-btn'},
            // 时间文字 $c：当前时间; $s：剩余时间; $d：总时间,
            {type: 'time', value: '$c / $d'},
            // 声音控件
            {type: 'voice'},
          ],
          right: [
            // 可选列表，自定义, 当prop: 'rate',会触发 setRate(rate)
            {type: 'list-btn', options: ['1.0x', '1.25x', '1.5x', '2.0x'], value: '1.0x', prop: 'rate'},
            {type: 'list-btn', options: ['标清', '高清', '超清', '默认'], value: '默认', prop: 'definition'},
            // 全屏播放
            {type: 'full-btn'},
          ]
        },

        // video-player组件配置
        playerOptions: {
          playbackRates: [1.0, 1.25, 1.5, 2.0], //播放速度
          autoplay: false, //如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。

          controls: false, // 是否显示播放控件

          preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: 'zh-CN',
          aspectRatio: '', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [],
          poster: '', //你的封面地址
          width: document.documentElement.clientWidth,
          flash: {hls: {withCredentials: false}},
          html5: {hls: {withCredentials: false}},
          notSupportedMessage: '此视频暂时无法播放', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true  //全屏按钮
          }
        },

        // 直播组件配置
        liveOptions: {
          source: {},
          language: 'zh-CN',
          live: true,
          autoplay: true,
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          controls: false, // 是否显示播放控件
          poster: '', //你的封面地址
        },
        // 播放速度可选列表
        playbackRates: [],
        // 配置可以播放的视频的格式 后缀：文件类型
        typeObj: {
          //你的m3u8地址（必填）application/x-mpegURL
          m3u8: 'application/x-mpegURL',
          //你的mp4地址（必填）video/mp4
          mp4: 'video/mp4',
        },
        // 当文件后缀不在上述配置中时使用此文件类型
        defaultVideoType: 'video/mp4',
        // 当前播放内容的player对象
        player: null,
        // 当前是否为全屏
        isFullScreen: false,
        // 是否显示控件
        showCtr: false,
        // 控件自动收起定时器
        ctrTimer: null,
        // 当前播放时间
        currentTime: 0,
        // 视频总时长
        duration: 0,
        // 剩余时长
        surplus: 0,
        // 音量 0-1
        volume: 0,
      }
    },
    components: {
      videoPlayer
    },
    watch: {
      // 播放地址改变时初始化播放器
      videoSrc(val) {
        this.setPlayUrl();
      }
    },
    methods: {
      // 播放器就绪回调
      onPlayerReady(player) {
        this.$emit('ready', player);
      },
      // 视频就绪回调
      onPlayerLoadedData(player) {
        this.player = player;
        this.duration = player.duration();
        this.currentTime = 0;
        this.volume = player.volume();
        this.playing = false;
        this.$emit('load', player);
      },
      // 设置音量
      setVolume(e) {
        let w = this.$refs.volumeBox[0].offsetWidth;
        let curr = e.offsetX;
        this.volume = curr / w;
        this.player.volume(curr / w);
      },
      // 跳转到指定播放时间
      setCurrentTime(e) {
        let w = this.$refs.myBottomControls.offsetWidth;
        let curr = e.offsetX;
        let y = e.offsetY;
        let isActive = e.target.className.split(/\s+/ig).includes('current-time-line');
        (isActive || y <= 0) && this.player.currentTime(curr / w * this.duration);
      },
      // 显示播放控件
      showControls() {
        clearTimeout(this.ctrTimer);
        this.showCtr = true;
        this.ctrTimer = setTimeout(() => {
          this.showCtr = false;
        }, 2500);
      },
      // 播放/暂停
      play() {
        if (this.playing) {
          this.player.pause();
        } else {
          this.player.play();
        }
      },
      // 播放回调
      onPlayerPlay(player) {
        this.playing = true;
        this.$emit('play', player);
      },
      onPlayerPlaying(player) {
        this.$emit('playing', player);
      },
      // 播放过程中回调
      onPlayerTimeUpdate(player) {
        this.currentTime = player.currentTime();
        this.surplus = this.duration - this.currentTime;
        this.$emit('timeupdate', player);
      },
      // 播放到结束回调
      onPlayerEnded(player) {
        this.$emit('ended', player);
      },
      // 播放暂停回调
      onPlayerPause(player) {
        this.playing = false;
        this.$emit('pause', player);
      },
      // 全屏/退出全屏
      fullScreen() {
        let el = document.documentElement;
        let full = [
          'requestFullscreen',
          'msRequestFullscreen',
          'mozRequestFullScreen',
          'webkitRequestFullscreen',
        ];
        let doc = document;
        let exit = [
          'exitFullscreen',
          'msExitFullscreen',
          'mozCancelFullScreen',
          'webkitExitFullscreen',
        ];
        if (this.isFullScreen) {
          // 退出全屏
          for (let e of exit) {
            if (doc[e]) {
              doc[e]();
              break;
            }
          }
        } else {
          // 全屏
          for (let e of full) {
            if (el[e]) {
              el[e]();
              break;
            }
          }
        }
      },
      // 设置播放速度
      setRate(text) {
        text = parseFloat(text);
        this.player.playbackRate(text);
      },
      // 选择自定义控件列表回调
      optionsCallback(item, text, e) {
        item && (item.value = text);
        if (item.prop === 'rate') {
          this.setRate(text);
        }
        this.$emit('optionsCallback', item);
        this.unHover = true;
        setTimeout(() => {
          this.unHover = false;
        }, 300);
      },
      // 初始化播放器
      setPlayUrl() {
        let videoType = this.videoSrc.split('.').pop();
        let source = {
          withCredentials: false,
          type: this.typeObj[videoType] || this.defaultVideoType,
          src: this.videoSrc
        };
        if (this.type === 'live') {
          this.playerOptions.sources = [source];
        } else {
          this.playerOptions.source = source;
        }
        this.playerOptions.poster = this.poster;
      },
      // 辅助实现全屏/退出全屏
      winFullCallback(e) {
        this.isFullScreen = !!(document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
      },
      // 获取可以设置的播放速度
      getPlaybackRates() {
        let playbackRates = [];
        this.controls.left.map(e => e.type === 'list-btn' && e.prop === 'rate' && e.options.map(opt => parseFloat(opt) && !playbackRates.includes(parseFloat(opt)) && playbackRates.push(parseFloat(opt))));
        this.controls.right.map(e => e.type === 'list-btn' && e.prop === 'rate' && e.options.map(opt => parseFloat(opt) && !playbackRates.includes(parseFloat(opt)) && playbackRates.push(parseFloat(opt))));
        console.log(playbackRates);
        return playbackRates;
      },
    },
    computed: {
      // player(player) {
      //   return this.$refs.videoPlayer.player;
      // }
    },
    created() {
      // return;
      // 设置播放控件列表
      console.log(this.unHover);
      this.$emit('set-controls', this.controls);
      // 设置播放器尺寸
      this.playerOptions.aspectRatio = this.aspect;
      // 设置播放速度列表
      this.playerOptions.playbackRates = this.getPlaybackRates();
      // 是否为直播
      if (this.type === 'live') {
        this.playerOptions = this.liveOptions;
      }
      if (this.videoSrc) {
        this.setPlayUrl();
      }
      window.removeEventListener('resize', this.winFullCallback);
      window.addEventListener('resize', this.winFullCallback);
    },
  }
</script>

<style scoped lang="less">
  .full-screen-box {
    position: fixed;
    z-index: 10000;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  .my-play-controls {
    .my-bottom-controls {
      transform: translateY(100% - 5px);
      &.show-controls {
        transform: translateY(0);
      }
      transition: transform .3s;
      color: #fff;
      font-size: 12px;
      line-height: 37px;
      height: 37px;
      background-color: rgba(0, 0, 0, .4);
      opacity: .8;
      border-top: 5px solid #1c455d;
    }
    .current-time-line {
      top: -5px;
      height: 5px;
      background-color: #188eee;
      .circle {
        width: 6px;
        height: 6px;
        border: 3px #fff solid;
        border-radius: 50%;
        background-color: #188eee;
        transform: translate(50%, -33%);
      }
    }
    .play-btn {
      margin: 0 19px 0 12px;
      color: #188eee;
      font-size: 28px;
      line-height: 37px;
      &.playing {
        &:after {
          content: '';
          margin: 14px 8px 0;
          display: inline-block;
          vertical-align: top;
          width: 4px;
          height: 10px;
          border-right: 4px solid #fff;
          border-left: 4px solid #fff;
        }
      }
    }
    .voice {
      margin-left: 32px;
      font-size: 20px;
      line-height: 34px;
      .voice-img {
        width: 15px;
        height: 15px;
      }
      .voice-line {
        width: 67px;
        height: 5px;
        border-radius: 10px;
        background-color: #9498a5;
        .line-inner {
          border-radius: 10px;
          background-color: #fff;
        }
      }
    }

    .full-screen {
      margin: 0 12px 0 20px;
      font-size: 20px;
      line-height: 37px;
    }
    .definition {
      margin-left: 8px;
      width: 50px;
    }
    .select {
      width: 50px;
      &:hover {
        color: #00b776;
        .select-box {
          transform: translateY(-100%);
          background-color: #071d19;
          color: #e8e8f0;
          opacity: .9;
          .active {
            color: #00b776;
          }
        }
      }
      .select-box {
        opacity: 0;
        .select-item {
          &:hover {
            background-color: #22413d;
          }
        }
      }
    }
  }
</style>
