<template>
  <view>
    <!-- 导航栏 -->
    <!-- #ifndef MP-BAIDU -->
    <uni-nav-bar
      left-icon="back"
      right-icon="more-filled"
      :title="title"
      :shadow="false"
      fixed
      status-bar
      background-color="#f1f1f1"
      @clickLeft="back"
      @clickRight="toSetting"
    ></uni-nav-bar>
    <!-- #endif -->
    <!-- #ifdef MP-BAIDU -->
    <u-navbar
      :title="title"
      back-text="返回"
      customBack
      @customBack="back"
      @titleClick="titleClick"
    ></u-navbar>
    <!-- #endif -->
    <u-mask :show="showMask" :mask-click-able="true" @click="maskClick">
      <view class="to_title">
        <view class="title-img">
          <image style="width: 200rpx; height: 200rpx" :src="to_title"></image>
        </view>
        <text class="text-white text-xl padding-xs"
          >点击顶部标题，即可进入设置页</text
        >
      </view>
    </u-mask>
    <!-- 公告 -->
    <view class="notice" v-if="CurrentToCircle.notice">
      <view
        class="notice-content"
        :class="['animation-' + noticeAnimation]"
        ref="notice"
      >
        <view class="cu-dialog">
          <view class="cu-bar bg-white justify-end">
            <view class="content">圈公告</view>
          </view>
          <view class="padding-xl">{{ CurrentToCircle.notice }}</view>
        </view>
      </view>
      <button
        class="cu-btn round notice-btn"
        :class="{
          'bg-blue': CurrentToCircle.circleType === '交友圈',
          'bg-yellow': CurrentToCircle.circleType === '固定圈',
          'bg-red': CurrentToCircle.circleType === '紧急圈'
        }"
        @click="noticeClick"
      >
        <text class="lg text-white cuIcon-right"></text>
      </button>
    </view>
    <!-- 寻人寻启事 -->
    <view class="cu-modal" :class="showUrgent ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">
            {{ urgent.type === 'person' ? '寻人启事' : '寻物启事' }}</view
          >
          <view class="action" @tap="showUrgent = false">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view class="padding-xl text-left">
          <view v-if="urgent.name" class="margin-bottom-xs text-cut">
            <text>{{ urgent.type === 'person' ? '姓名：' : '名称：' }}</text>
            <text>{{ urgent.name }}</text>
          </view>
          <view v-if="urgent.size" class="margin-tb-xs text-cut">
            <text>{{ urgent.type === 'person' ? '年龄：' : '尺寸：' }}</text>
            <text>{{ urgent.size }}</text>
          </view>
          <view v-if="urgent.form" class="margin-tb-xs text-cut">
            <text>{{
              urgent.type === 'person' ? '穿着打扮：' : '物品形状：'
            }}</text>
            <text>{{ urgent.form }}</text>
          </view>
          <view v-if="urgent.properties" class="margin-tb-xs text-cut">
            <text>{{
              urgent.type === 'person' ? '性格特征：' : '物品特征：'
            }}</text>
            <text>{{ urgent.properties }}</text>
          </view>
          <view v-if="urgent.supply" class="margin-tb-xs text-cut">
            <text>补充说明：</text>
            <text>{{ urgent.supply }}</text>
          </view>
          <view v-if="urgent.createTime" class="margin-tb-xs text-cut">
            <text>{{
              urgent.type === 'person' ? '走失时间：' : '丢失时间：'
            }}</text>
            <text>{{ urgent.createTime }}</text>
          </view>

          <view v-if="urgent.picture" class="margin-top-lg">
            <u-image
              width="100%"
              height="300rpx"
              :src="urgent.picture"
            ></u-image>
          </view>
        </view>
        <view class="cu-bar bg-white">
          <view class="action margin-0 flex-sub" @tap="toFindNoticeView"
            >查看详情</view
          >
        </view>
      </view>
    </view>
    <!-- 内容 -->
    <view class="content" @touchstart="hideDrawer">
      <scroll-view
        class="msg-list"
        :style="style"
        :scroll-y="true"
        :adjust-position="false"
        :scroll-with-animation="scrollAnimation"
        :scroll-top="scrollTop"
        :scroll-into-view="scrollToView"
        @scrolltoupper="loadHistory"
        upper-threshold="50"
      >
        <!-- 加载历史数据waitingUI -->
        <view class="loading" v-if="showLoading">
          <view class="spinner">
            <view class="rect1"></view>
            <view class="rect2"></view>
            <view class="rect3"></view>
            <view class="rect4"></view>
            <view class="rect5"></view>
          </view>
        </view>
        <view
          class="row"
          v-for="(row, index) in msgList"
          :key="index"
          :id="'msg' + row.msg.id"
        >
          <!-- 系统消息 -->
          <block v-if="row.type == 'system'">
            <view class="system">
              <!-- 文字消息 -->
              <view v-if="row.msg.type == 'text'" class="text">
                {{ row.msg.content.text }}
              </view>
            </view>
          </block>
          <!-- 用户消息 -->
          <block v-if="row.type == 'user'">
            <!-- 时间 -->
            <view
              v-show="row.msg.showTime"
              class="text-sm text-gray text-center margin-tb-sm"
              style="width: 100%"
              >{{ formatTime(row.msg.time) }}</view
            >
            <!-- 自己发出的消息 -->
            <view class="my" v-if="row.msg.userinfo.uid == myuid">
              <!-- 左-消息 -->
              <view class="left">
                <!-- 文字消息 -->
                <view v-if="row.msg.type == 'text'" class="bubble">
                  <rich-text :nodes="row.msg.content.text"></rich-text>
                </view>
                <!-- 语言消息 -->
                <view
                  v-if="row.msg.type == 'voice'"
                  class="bubble voice"
                  @tap="playVoice(row.msg)"
                  :class="playMsgid == row.msg.id ? 'play' : ''"
                >
                  <view class="length">{{ row.msg.content.length }}</view>
                  <view class="icon my-voice"></view>
                </view>
                <!-- 图片消息 -->
                <view
                  v-if="row.msg.type == 'img'"
                  class="bubble img"
                  @tap="showPic(row.msg)"
                >
                  <image
                    :src="row.msg.content.url"
                    :style="{
                      width: row.msg.content.w + 'px',
                      height: row.msg.content.h + 'px'
                    }"
                  ></image>
                </view>
              </view>
              <!-- 右-头像 -->
              <view class="right" @tap="toPersonInfo(myuid)">
                <image :src="row.msg.userinfo.face"></image>
              </view>
            </view>
            <!-- 别人发出的消息 -->
            <view class="other" v-if="row.msg.userinfo.uid != myuid">
              <!-- 左-头像 -->
              <view class="left" @tap="toPersonInfo(row.msg.userinfo.uid)">
                <image :src="row.msg.userinfo.face"></image>
              </view>
              <!-- 右-用户名称-时间-消息 -->
              <view class="right">
                <view class="username" v-if="isCircle">
                  <view
                    v-if="row.msg.userinfo.uid === CurrentToCircle.userId"
                    class="cu-tag radius sm bg-yellow text-white margin-right-xs"
                    >圈主</view
                  >
                  <view class="name">{{ row.msg.userinfo.username }}</view>
                  <!-- <view class="time">{{ formatTime(row.msg.time) }}</view> -->
                </view>
                <!-- 文字消息 -->
                <view v-if="row.msg.type == 'text'" class="bubble">
                  <rich-text :nodes="row.msg.content.text"></rich-text>
                </view>
                <!-- 语音消息 -->
                <view
                  v-if="row.msg.type == 'voice'"
                  class="bubble voice"
                  @tap="playVoice(row.msg)"
                  :class="playMsgid == row.msg.id ? 'play' : ''"
                >
                  <view class="icon other-voice"></view>
                  <view class="length">{{ row.msg.content.length }}</view>
                </view>
                <!-- 图片消息 -->
                <view
                  v-if="row.msg.type == 'img'"
                  class="bubble img"
                  @tap="showPic(row.msg)"
                >
                  <image
                    :src="row.msg.content.url"
                    :style="{
                      width: row.msg.content.w + 'px',
                      height: row.msg.content.h + 'px'
                    }"
                  ></image>
                </view>
              </view>
            </view>
          </block>
        </view>
      </scroll-view>
    </view>
    <!-- 抽屉栏 -->
    <view
      class="popup-layer"
      :class="popupLayerClass"
      @touchmove.stop.prevent="discard"
    >
      <!-- 表情 -->
      <swiper
        class="emoji-swiper"
        :class="{ hidden: hideEmoji }"
        indicator-dots="true"
        duration="150"
      >
        <!--
        <swiper-item v-for="(page, pid) in emojiList" :key="pid">
          <view v-for="(em, eid) in page" :key="eid" @tap="addEmoji(em)">
            <image
              mode="widthFix"
              :src="'/static/chat/img/emoji/' + em.url"
            ></image>
          </view>
        </swiper-item>
         -->
        <swiper-item v-for="(page, pid) in emojis" :key="pid">
          <view
            v-for="(emoji, eid) in page"
            :key="eid"
            @tap="addEmoji(emoji.em)"
          >
            <view class="text-xxl">{{ emoji.em }}</view>
          </view>
        </swiper-item>
      </swiper>
      <!-- 更多功能 相册-拍照 -->
      <view class="more-layer" :class="{ hidden: hideMore }">
        <view class="list">
          <view class="box" @tap="chooseImage"
            ><view class="icon tupian2"></view
          ></view>
          <view class="box" @tap="camera"
            ><view class="icon paizhao"></view
          ></view>
        </view>
      </view>
    </view>
    <!-- 底部输入栏 -->
    <view
      class="input-box"
      :class="popupLayerClass"
      @touchmove.stop.prevent="discard"
    >
      <!-- H5下不能录音，输入栏布局改动一下 -->
      <!-- #ifndef H5 -->
      <view class="voice">
        <view
          class="icon"
          :class="isVoice ? 'jianpan' : 'yuyin'"
          @tap="switchVoice"
        ></view>
      </view>
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <view class="more" @tap="showMore">
        <view class="icon add"></view>
      </view>
      <!-- #endif -->
      <view class="textbox">
        <view
          class="voice-mode"
          :class="[isVoice ? '' : 'hidden', recording ? 'recording' : '']"
          @touchstart="voiceBegin"
          @touchmove.stop.prevent="voiceIng"
          @touchend="voiceEnd"
          @touchcancel="voiceCancel"
          >{{ voiceTis }}</view
        >
        <view class="text-mode" :class="isVoice ? 'hidden' : ''">
          <view class="box">
            <textarea
              :auto-height="true"
              :show-confirm-bar="false"
              :cursor-spacing="30"
              :maxlength="341"
              v-model="textMsg"
              @focus="textareaFocus"
            />
          </view>
          <view class="em" @tap="chooseEmoji">
            <view class="icon biaoqing"></view>
          </view>
        </view>
      </view>
      <!-- #ifndef H5 -->
      <view class="more" @tap="showMore">
        <view class="icon add"></view>
      </view>
      <!-- #endif -->
      <view class="send" :class="isVoice ? 'hidden' : ''" @tap="sendText">
        <view class="btn">发送</view>
      </view>
    </view>
    <!-- 录音UI效果 -->
    <view class="record" :class="recording ? '' : 'hidden'">
      <view class="ing" :class="willStop ? 'hidden' : ''"
        ><view class="icon luyin2"></view
      ></view>
      <view class="cancel" :class="willStop ? '' : 'hidden'"
        ><view class="icon chehui"></view
      ></view>
      <view class="tis" :class="willStop ? 'change' : ''">{{ recordTis }}</view>
    </view>
  </view>
</template>

<script>
import localStore from '@/helpers/localStore.js'
import Time from '@/helpers/time.js'
import { chatFormat, chatDetailFormat } from '@/helpers/chat.js'
import { cloneLoop } from '@/helpers/utils.js'
// import * as _ from '@/utils/lodash/lodash.js'
import { mapGetters, mapState } from 'vuex'
import { emojiUrl, receiveOneType, receiveCircleType } from '@/config/config.js'
import { getOldChatDetailPrivate, getOldChatDetailCircle } from '@/api/chat.js'

export default {
  data() {
    return {
      // mask显示
      showMask: false,
      to_title: '/static/guide/to_title.png',
      // 圈公告动画
      noticeAnimation: '',
      showNotice: false,
      // 寻人寻物启事
      showUrgent: false,
      // 标题
      title: '',
      // loading
      showLoading: false,
      //文字消息
      textMsg: '',
      //消息列表
      isHistoryLoading: false,
      scrollAnimation: false,
      scrollTop: 0,
      scrollToView: '',
      msgList: [],
      msgImgList: [],
      myuid: 0,
      toUserId: 0,
      // 历史聊天记录分页
      defaultOffset: 1,
      offset: 2,

      //录音相关参数
      // #ifndef H5
      //H5不能录音
      RECORDER: uni.getRecorderManager(),
      // #endif
      isVoice: false,
      voiceTis: '按住 说话',
      recordTis: '手指上滑 取消发送',
      recording: false,
      willStop: false,
      initPoint: { identifier: 0, Y: 0 },
      recordTimer: null,
      recordLength: 0,

      //播放语音相关参数
      AUDIO: uni.createInnerAudioContext(),
      playMsgid: null,
      VoiceTimer: null,
      // 抽屉参数
      popupLayerClass: '',
      // more参数
      hideMore: true,
      //表情定义
      hideEmoji: true,
      emojiList: [
        [
          { url: '100.gif', alt: '[微笑]' },
          { url: '101.gif', alt: '[伤心]' },
          { url: '102.gif', alt: '[美女]' },
          { url: '103.gif', alt: '[发呆]' },
          { url: '104.gif', alt: '[墨镜]' },
          { url: '105.gif', alt: '[哭]' },
          { url: '106.gif', alt: '[羞]' },
          { url: '107.gif', alt: '[哑]' },
          { url: '108.gif', alt: '[睡]' },
          { url: '109.gif', alt: '[哭]' },
          { url: '110.gif', alt: '[囧]' },
          { url: '111.gif', alt: '[怒]' },
          { url: '112.gif', alt: '[调皮]' },
          { url: '113.gif', alt: '[笑]' },
          { url: '114.gif', alt: '[惊讶]' },
          { url: '115.gif', alt: '[难过]' },
          { url: '116.gif', alt: '[酷]' },
          { url: '117.gif', alt: '[汗]' },
          { url: '118.gif', alt: '[抓狂]' },
          { url: '119.gif', alt: '[吐]' },
          { url: '120.gif', alt: '[笑]' },
          { url: '121.gif', alt: '[快乐]' },
          { url: '122.gif', alt: '[奇]' },
          { url: '123.gif', alt: '[傲]' }
        ],
        [
          { url: '124.gif', alt: '[饿]' },
          { url: '125.gif', alt: '[累]' },
          { url: '126.gif', alt: '[吓]' },
          { url: '127.gif', alt: '[汗]' },
          { url: '128.gif', alt: '[高兴]' },
          { url: '129.gif', alt: '[闲]' },
          { url: '130.gif', alt: '[努力]' },
          { url: '131.gif', alt: '[骂]' },
          { url: '132.gif', alt: '[疑问]' },
          { url: '133.gif', alt: '[秘密]' },
          { url: '134.gif', alt: '[乱]' },
          { url: '135.gif', alt: '[疯]' },
          { url: '136.gif', alt: '[哀]' },
          { url: '137.gif', alt: '[鬼]' },
          { url: '138.gif', alt: '[打击]' },
          { url: '139.gif', alt: '[bye]' },
          { url: '140.gif', alt: '[汗]' },
          { url: '141.gif', alt: '[抠]' },
          { url: '142.gif', alt: '[鼓掌]' },
          { url: '143.gif', alt: '[糟糕]' },
          { url: '144.gif', alt: '[恶搞]' },
          { url: '145.gif', alt: '[什么]' },
          { url: '146.gif', alt: '[什么]' },
          { url: '147.gif', alt: '[累]' }
        ],
        [
          { url: '148.gif', alt: '[看]' },
          { url: '149.gif', alt: '[难过]' },
          { url: '150.gif', alt: '[难过]' },
          { url: '151.gif', alt: '[坏]' },
          { url: '152.gif', alt: '[亲]' },
          { url: '153.gif', alt: '[吓]' },
          { url: '154.gif', alt: '[可怜]' },
          { url: '155.gif', alt: '[刀]' },
          { url: '156.gif', alt: '[水果]' },
          { url: '157.gif', alt: '[酒]' },
          { url: '158.gif', alt: '[篮球]' },
          { url: '159.gif', alt: '[乒乓]' },
          { url: '160.gif', alt: '[咖啡]' },
          { url: '161.gif', alt: '[美食]' },
          { url: '162.gif', alt: '[动物]' },
          { url: '163.gif', alt: '[鲜花]' },
          { url: '164.gif', alt: '[枯]' },
          { url: '165.gif', alt: '[唇]' },
          { url: '166.gif', alt: '[爱]' },
          { url: '167.gif', alt: '[分手]' },
          { url: '168.gif', alt: '[生日]' },
          { url: '169.gif', alt: '[电]' },
          { url: '170.gif', alt: '[炸弹]' },
          { url: '171.gif', alt: '[刀子]' }
        ],
        [
          { url: '172.gif', alt: '[足球]' },
          { url: '173.gif', alt: '[瓢虫]' },
          { url: '174.gif', alt: '[翔]' },
          { url: '175.gif', alt: '[月亮]' },
          { url: '176.gif', alt: '[太阳]' },
          { url: '177.gif', alt: '[礼物]' },
          { url: '178.gif', alt: '[抱抱]' },
          { url: '179.gif', alt: '[拇指]' },
          { url: '180.gif', alt: '[贬低]' },
          { url: '181.gif', alt: '[握手]' },
          { url: '182.gif', alt: '[剪刀手]' },
          { url: '183.gif', alt: '[抱拳]' },
          { url: '184.gif', alt: '[勾引]' },
          { url: '185.gif', alt: '[拳头]' },
          { url: '186.gif', alt: '[小拇指]' },
          { url: '187.gif', alt: '[拇指八]' },
          { url: '188.gif', alt: '[食指]' },
          { url: '189.gif', alt: '[ok]' },
          { url: '190.gif', alt: '[情侣]' },
          { url: '191.gif', alt: '[爱心]' },
          { url: '192.gif', alt: '[蹦哒]' },
          { url: '193.gif', alt: '[颤抖]' },
          { url: '194.gif', alt: '[怄气]' },
          { url: '195.gif', alt: '[跳舞]' }
        ],
        [
          { url: '196.gif', alt: '[发呆]' },
          { url: '197.gif', alt: '[背着]' },
          { url: '198.gif', alt: '[伸手]' },
          { url: '199.gif', alt: '[耍帅]' },
          { url: '200.png', alt: '[微笑]' },
          { url: '201.png', alt: '[生病]' },
          { url: '202.png', alt: '[哭泣]' },
          { url: '203.png', alt: '[吐舌]' },
          { url: '204.png', alt: '[迷糊]' },
          { url: '205.png', alt: '[瞪眼]' },
          { url: '206.png', alt: '[恐怖]' },
          { url: '207.png', alt: '[忧愁]' },
          { url: '208.png', alt: '[眨眉]' },
          { url: '209.png', alt: '[闭眼]' },
          { url: '210.png', alt: '[鄙视]' },
          { url: '211.png', alt: '[阴暗]' },
          { url: '212.png', alt: '[小鬼]' },
          { url: '213.png', alt: '[礼物]' },
          { url: '214.png', alt: '[拜佛]' },
          { url: '215.png', alt: '[力量]' },
          { url: '216.png', alt: '[金钱]' },
          { url: '217.png', alt: '[蛋糕]' },
          { url: '218.png', alt: '[彩带]' },
          { url: '219.png', alt: '[礼物]' }
        ]
      ],
      emojis: [
        [
          { em: '😋' },
          { em: '😌' },
          { em: '😍' },
          { em: '😏' },
          { em: '😜' },
          { em: '😝' },
          { em: '😞' },
          { em: '😔' },
          { em: '😪' },
          { em: '😭' },
          { em: '😁' },
          { em: '😂' },
          { em: '😃' },
          { em: '😅' },
          { em: '😆' },
          { em: '👿' },
          { em: '😒' },
          { em: '😓' },
          { em: '😖' },
          { em: '😘' },
          { em: '😚' },
          { em: '😡' },
          { em: '😢' },
          { em: '😣' }
        ],
        [
          { em: '😤' },
          { em: '😨' },
          { em: '😳' },
          { em: '😵' },
          { em: '😷' },
          { em: '😸' },
          { em: '😻' },
          { em: '😼' },
          { em: '😽' },
          { em: '😾' },
          { em: '😿' },
          { em: '🙊' },
          { em: '🙋' },
          { em: '🙏' },
          { em: '✈' },
          { em: '🚇' },
          { em: '🚃' },
          { em: '🚌' },
          { em: '🍄' },
          { em: '🍅' },
          { em: '🍆' },
          { em: '🍇' },
          { em: '🍈' },
          { em: '🍉' }
        ],
        [
          { em: '🍑' },
          { em: '🍒' },
          { em: '🍓' },
          { em: '🐔' },
          { em: '🐶' },
          { em: '🐷' },
          { em: '👦' },
          { em: '👧' },
          { em: '👱' },
          { em: '👩' },
          { em: '👰' },
          { em: '👨' },
          { em: '👲' },
          { em: '👳' },
          { em: '💃' },
          { em: '💄' },
          { em: '💅' },
          { em: '💆' },
          { em: '🌹' },
          { em: '💑' },
          { em: '💓' },
          { em: '💘' },
          { em: '🚲' },
          { em: '🐛' }
        ],
        [
          { em: '✊' },
          { em: '✋' },
          { em: '✌' },
          { em: '👊' },
          { em: '👍' },
          { em: '☝' },
          { em: '👆' },
          { em: '👇' },
          { em: '👈' },
          { em: '👉' },
          { em: '👋' },
          { em: '👏' },
          { em: '👌' },
          { em: '👎' },
          { em: '👐' },
          { em: '🐌' },
          { em: '🐍' },
          { em: '🐎' },
          { em: '🐫' },
          { em: '🐗' },
          { em: '🐘' },
          { em: '🐨' },
          { em: '🐒' },
          { em: '🐑' }
        ],
        [
          { em: '☀' },
          { em: '☁' },
          { em: '☔' },
          { em: '⛄' },
          { em: '⚡' },
          { em: '🌀' },
          { em: '🌂' },
          { em: '🌄' },
          { em: '🌈' },
          { em: '❄' },
          { em: '⛅' },
          { em: '🌕' },
          { em: '🌛' },
          { em: '👀' },
          { em: '👃' },
          { em: '👻' },
          { em: '👽' }
        ]
      ]
    }
  },

  computed: {
    ...mapState(['imageUrl', 'uploadUrl']),
    ...mapGetters('user', ['userId', 'username', 'avatar', 'personinfo']),
    ...mapState('chat', ['CurrentToUser', 'CurrentToCircle', 'isCircle']),
    ...mapGetters('circle', ['circleInfo', 'urgent']),
    style() {
      const CustomBar = this.CustomBar
      const style = `padding-top:${CustomBar}px;`
      return style
    },
    hasUrgent() {
      return Object.keys(this.urgent).length > 0 && !this.urgent.handle
    }
  },

  watch: {
    hasUrgent(val) {
      this.showUrgent = val
    }
  },

  onReady() {
    if (!uni.getStorageSync('chatMaskShowed')) this.showMask = true
    // 显示寻人寻物启事
    this.$nextTick(() => {
      if (this.hasUrgent) this.showUrgent = true
    })
    // 开启监听
    uni.$on('UserChat', (data) => {
      if (
        (this.CurrentToUser.userId === data.body.userId &&
          data.type === receiveOneType) ||
        (this.CurrentToCircle.circleId === data.body.circleId &&
          data.type === receiveCircleType)
      ) {
        let msg = chatFormat(data, {
          type: 'chatDetail',
          oldData: this.msgList,
          isCircle: this.isCircle
        })
        msg.msg.content = this.setPicSize(msg.msg.content)
        this.msgImgList?.push(msg.msg.content.url)
        this.msgList?.push(msg)
        // 滚动到底
        this.$nextTick(() => {
          this.scrollToView = 'msg' + msg.msg.id
        })
      }
    })
  },

  async onLoad(options) {
    this.showLoading = true //开启 loading 动画
    if (options.personInfo) {
      const personInfo = JSON.parse(decodeURIComponent(options.personInfo))
      // this.toUserId = options.personId
      // await this.$store.dispatch('user/getPersonInfo', options.personId)
      const { userId, username, img: avatar } = personInfo
      this.toUserId = userId
      this.$store.commit('chat/setCurrentToUser', { userId, username, avatar })
      // 修改标题
      this.title = username
      // 修改圈状态
      this.$store.commit('chat/setIsCircle', false)
      // 清空寻人寻物启事
      this.$store.commit('circle/setUrgent', {})
    } else if (options.circleInfo) {
      const circleInfo = JSON.parse(decodeURIComponent(options.circleInfo))
      // await this.$store.dispatch('circle/getCircleInfo', options.circleId)
      const {
        circleId,
        circleName,
        img: circleAvatar,
        type: circleType,
        member,
        notice,
        userId
      } = circleInfo
      this.$store.commit('chat/setCurrentToCircle', {
        circleId,
        circleName,
        circleAvatar,
        circleType,
        notice,
        userId
      })
      // 修改标题
      this.title = `${circleName}（${member}）`
      // 修改圈状态
      this.$store.commit('chat/setIsCircle', true)
      // 紧急圈寻人寻物启事
      if (circleType === '紧急圈') {
        this.$store.dispatch('circle/getUrgent', circleId)
      } else {
        // 清空寻人寻物启事
        this.$store.commit('circle/setUrgent', {})
      }
    } else {
      uni.showToast({ title: '不存在的用户或圈', icon: 'none' })
      return uni.navigateBack()
    }

    // 初始化聊天对象
    this.myuid = this.userId

    this.getMsgList()
    //语音自然播放结束
    this.AUDIO.onEnded((res) => {
      this.playMsgid = null
    })
    // #ifndef H5
    //录音开始事件
    this.RECORDER.onStart((e) => {
      this.recordBegin(e)
    })
    //录音结束事件
    this.RECORDER.onStop((e) => {
      this.recordEnd(e)
    })
    // #endif
  },

  onUnload() {
    // 读取消息
    this.readMsg()
    if (this.isCircle) {
      // 重置圈聊天对象
      this.$store.commit('chat/setCurrentToCircle', {
        circleId: 0,
        circleName: '',
        circleAvatar: '',
        circleType: '',
        userId: 0
      })
      // 修改圈状态
      this.$store.commit('chat/setIsCircle', false)
    } else {
      // 重置单人聊天对象
      this.$store.commit('chat/setCurrentToUser', {
        userId: 0,
        username: '',
        avatar: ''
      })
    }
  },

  async onShow() {
    /*
    if (this.toUserId) {
      await this.$store.dispatch('user/getPersonInfo', this.toUserId)
      const { isFocus } = this.personinfo
      if (isFocus !== 3) {
        uni.showToast({
          title: '双方关注才可聊天',
          icon: 'none'
        })
        setTimeout(() => {
          uni.switchTab({
            url: '/pages/msg/msg'
          })
        }, 1000)
      }
      this.scrollTop = 9999999
		}
		 */
  },

  onHide() {
    // 读取消息
    this.readMsg()
  },

  methods: {
    maskClick() {
      this.showMask = false
      uni.setStorageSync('chatMaskShowed', true)
    },

    noticeClick() {
      if (!this.showNotice) {
        this.showNotice = true
        this.noticeAnimation = 'notice-slide-right'
      } else {
        this.showNotice = false
        this.noticeAnimation = ''
      }
    },

    back() {
      uni.switchTab({
        url: '/pages/msg/msg'
      })
    },

    toPersonInfo(id) {
      this.$u.route({
        type: 'redirect',
        url: '/pages/components/person-info/person-info',
        params: {
          id
        }
      })
    },

    titleClick() {
      if (this.isCircle) {
        this.$u.route({
          type: 'redirect',
          url: '/pages/components/circle-setting/circle-setting',
          params: {
            circleId: this.CurrentToCircle.circleId
          }
        })
      } else {
        this.toPersonInfo(this.CurrentToUser.userId)
      }
    },

    toFindNoticeView() {
      this.$u.route({
        type: 'redirect',
        url: '/pages/components/find-notice/find-notice-view',
        params: {
          circleId: this.CurrentToCircle.circleId,
          ownerId: this.CurrentToCircle.userId
        }
      })
    },

    // 时间格式化
    formatTime(time) {
      if (time) return Time.getDetailTime(Number(time))
    },

    // 接受消息(筛选处理)
    screenMsg(msg) {
      //从长连接处转发给这个方法，进行筛选处理
      if (msg.type == 'system') {
        // 系统消息
        switch (msg.msg.type) {
          case 'text':
            this.addSystemTextMsg(msg)
            break
          case 'redEnvelope':
            this.addSystemRedEnvelopeMsg(msg)
            break
        }
      } else if (msg.type == 'user') {
        // 用户消息
        switch (msg.msg.type) {
          case 'text':
            this.addTextMsg(msg)
            break
          case 'voice':
            this.addVoiceMsg(msg)
            break
          case 'img':
            this.addImgMsg(msg)
            break
          case 'redEnvelope':
            this.addRedEnvelopeMsg(msg)
            break
        }
        console.log('用户消息')
        //非自己的消息震动
        if (msg.msg.userinfo.uid != this.myuid) {
          console.log('振动')
          uni.vibrateLong()
        }
      }
      this.$nextTick(function () {
        // 滚动到底
        this.scrollToView = 'msg' + msg.msg.id
      })
    },

    // 读取消息
    async readMsg() {
      if (this.isCircle) {
        await this.$store.dispatch('chat/readMsg', {
          circleId: this.CurrentToCircle.circleId
        })
      } else {
        await this.$store.dispatch('chat/readMsg', {
          toUserId: this.CurrentToUser.userId
        })
      }
    },

    // 获取分页消息
    async getOffsetMsgList(offset) {
      let detail
      if (this.isCircle) {
        detail = await getOldChatDetailCircle({
          circleId: this.CurrentToCircle.circleId,
          offset
        })
      } else {
        detail = await getOldChatDetailPrivate({
          toUserId: this.CurrentToUser.userId,
          offset
        })
      }
      const detailList = chatDetailFormat(detail)
      return detailList
    },

    //触发滑动到顶部(加载历史信息记录)
    async loadHistory(e) {
      if (this.isHistoryLoading || this.showLoading) {
        return
      }
      this.isHistoryLoading = true //参数作为进入请求标识，防止重复请求
      this.showLoading = true //开启 loading 动画
      this.scrollAnimation = false //关闭滑动动画
      let Viewid = this.msgList[0].msg.id //记住第一个信息ID
      // 获取历史记录
      const detailList = await this.getOffsetMsgList(this.offset)
      this.offset++
      let list = detailList || []
      // 获取消息中的图片,并处理显示尺寸
      for (let i = 0; i < list.length; i++) {
        if (list[i].type == 'user' && list[i].msg.type == 'img') {
          list[i].msg.content = this.setPicSize(list[i].msg.content)
          this.msgImgList.unshift(list[i].msg.content.url)
        }
      }
      this.msgList = [...list, ...this.msgList]

      //这段代码很重要，不然每次加载历史数据都会跳到顶部
      this.$nextTick(function () {
        this.scrollToView = 'msg' + Viewid //跳转上次的第一行信息位置
        this.$nextTick(function () {
          this.scrollAnimation = true //恢复滚动动画
        })
      })
      this.isHistoryLoading = false
      this.showLoading = false
    },
    // 加载初始页面消息
    async getMsgList() {
      // 消息列表
      const detailList = await this.getOffsetMsgList(this.defaultOffset)
      let list = detailList || []
      // 获取消息中的图片,并处理显示尺寸
      for (let i = 0; i < list.length; i++) {
        if (list[i].type == 'user' && list[i].msg.type == 'img') {
          list[i].msg.content = this.setPicSize(list[i].msg.content)
          this.msgImgList.push(list[i].msg.content.url)
        }
      }
      this.msgList = list
      // 滚动到底部
      this.$nextTick(function () {
        //进入页面滚动到底部
        this.scrollTop = 9999
        this.$nextTick(function () {
          this.scrollAnimation = true
        })
      })
      this.showLoading = false
    },
    //处理图片尺寸，如果不处理宽高，新进入页面加载图片时候会闪
    setPicSize(content) {
      // 让图片最长边等于设置的最大长度，短边等比例缩小，图片控件真实改变，区别于aspectFit方式。
      let maxW = uni.upx2px(350) //350是定义消息图片最大宽度
      let maxH = uni.upx2px(350) //350是定义消息图片最大高度
      if (content.w > maxW || content.h > maxH) {
        let scale = content.w / content.h
        content.w = scale > 1 ? maxW : maxH * scale
        content.h = scale > 1 ? maxW / scale : maxH
      }
      return content
    },

    //更多功能(点击+弹出)
    showMore() {
      this.isVoice = false
      this.hideEmoji = true
      if (this.hideMore) {
        this.hideMore = false
        this.openDrawer()
      } else {
        this.hideDrawer()
      }
    },
    // 打开抽屉
    openDrawer() {
      this.popupLayerClass = 'showLayer'
    },
    // 隐藏抽屉
    hideDrawer() {
      this.popupLayerClass = ''
      setTimeout(() => {
        this.hideMore = true
        this.hideEmoji = true
      }, 150)
    },
    // 选择图片发送
    chooseImage() {
      this.getImage('album')
    },
    //拍照发送
    camera() {
      this.getImage('camera')
    },

    //选照片 or 拍照
    getImage(type) {
      this.hideDrawer()
      uni.chooseImage({
        sourceType: [type],
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        success: (res) => {
          uni.showLoading({
            title: '发送中...'
          })
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            uni.getImageInfo({
              src: res.tempFilePaths[i],
              success: (image) => {
                console.log(image.width)
                console.log(image.height)
                this.$store
                  .dispatch('uploadFile', {
                    filePath: res.tempFilePaths[i],
                    type: 'image',
                    userId: this.userId
                  })
                  .then(() => {
                    console.log(this.uploadUrl)
                    let msg = {
                      url: this.uploadUrl,
                      w: image.width,
                      h: image.height
                    }
                    uni.hideLoading()
                    this.sendMsg(msg, 'img')
                  })
                  .catch(() => uni.hideLoading())
              }
            })
          }
        }
      })
    },
    // 选择表情
    chooseEmoji() {
      this.hideMore = true
      if (this.hideEmoji) {
        this.hideEmoji = false
        this.openDrawer()
      } else {
        this.hideDrawer()
      }
    },
    //添加表情
    addEmoji(em) {
      // this.textMsg += em.alt
      this.textMsg += em
    },

    //获取焦点，如果不是选表情ing,则关闭抽屉
    textareaFocus() {
      if (this.popupLayerClass == 'showLayer' && this.hideMore == false) {
        this.hideDrawer()
      }
    },
    // 发送文字消息
    sendText() {
      this.hideDrawer() //隐藏抽屉
      if (!this.textMsg) {
        return
      }
      // let content = this.replaceEmoji(this.textMsg)
      // let msg = { text: content }
      let msg = { text: this.textMsg }
      this.sendMsg(msg, 'text')
      this.textMsg = '' //清空输入框
    },
    //替换表情符号为图片
    replaceEmoji(str) {
      let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g, (item, index) => {
        console.log('item: ' + item)
        for (let i = 0; i < this.emojiList.length; i++) {
          let row = this.emojiList[i]
          for (let j = 0; j < row.length; j++) {
            let EM = row[j]
            if (EM.alt == item) {
              //在线表情路径，图文混排必须使用网络路径，请上传一份表情到你的服务器后再替换此路径
              //比如你上传服务器后，你的100.gif路径为https://www.xxx.com/emoji/100.gif 则替换onlinePath填写为https://www.xxx.com/emoji/
              let onlinePath = emojiUrl
              let imgstr =
                '<img style="vertical-align:middle;" src="' +
                onlinePath +
                EM.url +
                '">'
              console.log('imgstr: ' + imgstr)
              return imgstr
            }
          }
        }
      })
      return replacedStr
    },

    // 发送消息
    async sendMsg(content, type) {
      //实际应用中，此处应该提交长连接，模板仅做本地处理。
      var nowDate = new Date().getTime()
      const lastTime =
        this.msgList?.length > 0
          ? [...this.msgList].reverse().find((i) => i.msg.time).msg.time
          : 0
      let lastid = this.msgList.length
        ? this.msgList[this.msgList.length - 1].msg.id
        : -1
      lastid++
      let msg = {
        type: 'user',
        msg: {
          id: lastid,
          showTime: Time.noFormatChatTime(nowDate, lastTime),
          time: nowDate,
          type: type,
          userinfo: {
            uid: this.userId,
            username: this.username,
            face: this.avatar
          },
          content: content
        }
      }
      // 发送消息
      try {
        await this.$store.dispatch('chat/send', msg)

        // 给添加到页面的消息添加样式
        // let message = _.cloneDeep(msg)
        let message = cloneLoop(msg)
        let item =
          '<div style="display: flex;align-items: center;word-wrap:break-word;">' +
          content +
          '</div>'
        message.msg.content = item
        this.screenMsg(msg)
      } catch (error) {
        uni.showToast({
          icon: 'none',
          title: '发送失败'
        })
      }
    },

    // 添加文字消息到列表
    addTextMsg(msg) {
      this.msgList.push(msg)
    },
    // 添加语音消息到列表
    addVoiceMsg(msg) {
      this.msgList.push(msg)
    },
    // 添加图片消息到列表
    addImgMsg(msg) {
      msg.msg.content = this.setPicSize(msg.msg.content)
      this.msgImgList.push(msg.msg.content.url)
      this.msgList.push(msg)
    },
    addRedEnvelopeMsg(msg) {
      this.msgList.push(msg)
    },
    // 添加系统文字消息到列表
    addSystemTextMsg(msg) {
      this.msgList.push(msg)
    },
    // 预览图片
    showPic(msg) {
      uni.previewImage({
        indicator: 'none',
        current: msg.content.url,
        urls: this.msgImgList
      })
    },
    // 播放语音
    playVoice(msg) {
      this.playMsgid = msg.id
      this.AUDIO.src = msg.content.url
      this.$nextTick(function () {
        this.AUDIO.play()
      })
    },
    // 录音开始
    voiceBegin(e) {
      if (e.touches.length > 1) {
        return
      }
      this.initPoint.Y = e.touches[0].clientY
      this.initPoint.identifier = e.touches[0].identifier
      this.RECORDER.start({ format: 'mp3' }) //录音开始,
    },
    //录音开始UI效果
    recordBegin(e) {
      this.recording = true
      this.voiceTis = '松开 结束'
      this.recordLength = 0
      this.recordTimer = setInterval(() => {
        this.recordLength++
      }, 1000)
    },
    // 录音被打断
    voiceCancel() {
      this.recording = false
      this.voiceTis = '按住 说话'
      this.recordTis = '手指上滑 取消发送'
      this.willStop = true //不发送录音
      this.RECORDER.stop() //录音结束
    },
    // 录音中(判断是否触发上滑取消发送)
    voiceIng(e) {
      if (!this.recording) {
        return
      }
      let touche = e.touches[0]
      //上滑一个导航栏的高度触发上滑取消发送
      if (this.initPoint.Y - touche.clientY >= uni.upx2px(100)) {
        this.willStop = true
        this.recordTis = '松开手指 取消发送'
      } else {
        this.willStop = false
        this.recordTis = '手指上滑 取消发送'
      }
    },
    // 结束录音
    voiceEnd(e) {
      if (!this.recording) {
        return
      }
      this.recording = false
      this.voiceTis = '按住 说话'
      this.recordTis = '手指上滑 取消发送'
      this.RECORDER.stop() //录音结束
    },
    //录音结束(回调文件)
    recordEnd(e) {
      clearInterval(this.recordTimer)
      if (!this.willStop) {
        console.log('e: ' + JSON.stringify(e))
        this.$store
          .dispatch('uploadFile', {
            filePath: e.tempFilePath,
            type: 'voice',
            userId: this.userId
          })
          .then(() => {
            console.log(this.uploadUrl)

            let msg = {
              length: 0,
              url: this.uploadUrl
            }
            let min = parseInt(this.recordLength / 60)
            let sec = this.recordLength % 60
            min = min < 10 ? '0' + min : min
            sec = sec < 10 ? '0' + sec : sec
            msg.length = min + ':' + sec
            this.sendMsg(msg, 'voice')
          })
      } else {
        console.log('取消发送录音')
      }
      this.willStop = false
    },
    // 切换语音/文字输入
    switchVoice() {
      this.hideDrawer()
      this.isVoice = this.isVoice ? false : true
    },
    discard() {
      return
    }
  }
}
</script>
<style lang="scss">
@import './style.scss';

.to-create {
  .create-img {
    position: relative;
    left: 40%;
    top: -15rpx;
  }
}

.to_title {
  width: 100%;
  text-align: center;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .title-img {
    position: absolute;
    top: -300rpx;
    left: 50%;
    transform: translateX(-50%);
  }
}

.notice {
  position: fixed;
  right: 0;
  bottom: 50%;
  z-index: 999;

  .notice-content {
    position: fixed;
    top: 25%;
    left: 100%;
  }

  @keyframes notice-slide-right {
    0% {
      opacity: 0;
      left: 100%;
    }

    100% {
      opacity: 1;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .notice-btn {
    position: relative;
    left: 30%;
  }
}
</style>
