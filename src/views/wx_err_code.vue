<template>
  <div class="err-code-body pb20">
    <input v-model="search" type="text" class="gl-input search tac pos t0 w100 bsb" placeholder="关键字搜索"/>
    <div class="err-code mlr-auto">
      <div class="flex jcb item tal"
           v-for="item in list" :key="item.code"
           v-if="!search || testSearch(item)">
        <div class="code flex-1">{{item.code}}</div>
        <div class="msg flex-3">{{item.msg}}</div>
        <div class="remark flex-3">{{item.remark}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "WxErrCode",
    data() {
      return {
        search: '',
        list: [
          {code: "40001", msg: "invalid credential", remark: "不合法的调用凭证"},
          {code: "40002", msg: "invalid grant_type", remark: "不合法的grant_type"},
          {code: "40003", msg: "invalid openid", remark: "不合法的OpenID"},
          {code: "40004", msg: "invalid media type", remark: "不合法的媒体文件类型"},
          {code: "40007", msg: "invalid media_id", remark: "不合法的media_id"},
          {code: "40008", msg: "invalid message type", remark: "不合法的message_type"},
          {code: "40009", msg: "invalid image size", remark: "不合法的图片大小"},
          {code: "40010", msg: "invalid voice size", remark: "不合法的语音大小"},
          {code: "40011", msg: "invalid video size", remark: "不合法的视频大小"},
          {code: "40012", msg: "invalid thumb size", remark: "不合法的缩略图大小"},
          {code: "40013", msg: "invalid appid", remark: "不合法的AppID"},
          {code: "40014", msg: "invalid access_token", remark: "不合法的access_token"},
          {code: "40015", msg: "invalid menu type", remark: "不合法的菜单类型"},
          {code: "40016", msg: "invalid button size", remark: "不合法的菜单按钮个数"},
          {code: "40017", msg: "invalid button type", remark: "不合法的按钮类型"},
          {code: "40018", msg: "invalid button name size", remark: "不合法的按钮名称长度"},
          {code: "40019", msg: "invalid button key size", remark: "不合法的按钮KEY长度"},
          {code: "40020", msg: "invalid button url size", remark: "不合法的url长度"},
          {code: "40023", msg: "invalid sub button size", remark: "不合法的子菜单按钮个数"},
          {code: "40024", msg: "invalid sub button type", remark: "不合法的子菜单类型"},
          {code: "40025", msg: "invalid sub button name size", remark: "不合法的子菜单按钮名称长度"},
          {code: "40026", msg: "invalid sub button key size", remark: "不合法的子菜单按钮KEY长度"},
          {code: "40027", msg: "invalid sub button url size", remark: "不合法的子菜单按钮url长度"},
          {code: "40029", msg: "invalid code", remark: "不合法或已过期的code"},
          {code: "40030", msg: "invalid refresh_token", remark: "不合法的refresh_token"},
          {code: "40036", msg: "invalid template_id size", remark: "不合法的template_id长度"},
          {code: "40037", msg: "invalid template_id", remark: "不合法的template_id"},
          {code: "40039", msg: "invalid url size", remark: "不合法的url长度"},
          {code: "40048", msg: "invalid url domain", remark: "不合法的url域名"},
          {code: "40054", msg: "invalid sub button url domain", remark: "不合法的子菜单按钮url域名"},
          {code: "40055", msg: "invalid button url domain", remark: "不合法的菜单按钮url域名"},
          {code: "40066", msg: "invalid url", remark: "不合法的url"},
          {code: "41001", msg: "access_token missing", remark: "缺失access_token参数"},
          {code: "41002", msg: "appid missing", remark: "缺失appid参数"},
          {code: "41003", msg: "refresh_token missing", remark: "缺失refresh_token参数"},
          {code: "41004", msg: "appsecret missing", remark: "缺失secret参数"},
          {code: "41005", msg: "media data missing", remark: "缺失二进制媒体文件"},
          {code: "41006", msg: "media_id missing", remark: "缺失media_id参数"},
          {code: "41007", msg: "sub_menu data missing", remark: "缺失子菜单数据"},
          {code: "41008", msg: "missing code", remark: "缺失code参数"},
          {code: "41009", msg: "missing openid", remark: "缺失openid参数"},
          {code: "41010", msg: "missing url", remark: "缺失url参数"},
          {code: "42001", msg: "access_token expired", remark: "access_token超时"},
          {code: "42002", msg: "refresh_token expired", remark: "refresh_token超时"},
          {code: "42003", msg: "code expired", remark: "code超时"},
          {code: "43001", msg: "require GET method", remark: "需要使用GET方法请求"},
          {code: "43002", msg: "require POST method", remark: "需要使用POST方法请求"},
          {code: "43003", msg: "require https", remark: "需要使用HTTPS"},
          {code: "43004", msg: "require subscribe", remark: "需要订阅关系"},
          {code: "44001", msg: "empty media data", remark: "空白的二进制数据"},
          {code: "44002", msg: "empty post data", remark: "空白的POST数据"},
          {code: "44003", msg: "empty news data", remark: "空白的news数据"},
          {code: "44004", msg: "empty content", remark: "空白的内容"},
          {code: "44005", msg: "empty list size", remark: "空白的列表"},
          {code: "45001", msg: "media size out of limit", remark: "二进制文件超过限制"},
          {code: "45002", msg: "content size out of limit", remark: "content参数超过限制"},
          {code: "45003", msg: "title size out of limit", remark: "title参数超过限制"},
          {code: "45004", msg: "description size out of limit", remark: "description参数超过限制"},
          {code: "45005", msg: "url size out of limit", remark: "url参数长度超过限制"},
          {code: "45006", msg: "picurl size out of limit", remark: "picurl参数超过限制"},
          {code: "45007", msg: "playtime out of limit", remark: "播放时间超过限制（语音为60s最大）"},
          {code: "45008", msg: "article size out of limit", remark: "article参数超过限制"},
          {code: "45009", msg: "api freq out of limit", remark: "接口调动频率超过限制"},
          {code: "45010", msg: "create menu limit", remark: "建立菜单被限制"},
          {code: "45011", msg: "api limit", remark: "频率限制"},
          {code: "45012", msg: "template size out of limit", remark: "模板大小超过限制"},
          {code: "45016", msg: "can't modify sys group", remark: "不能修改默认组"},
          {code: "45017", msg: "can't set group name too long sys group", remark: "修改组名过长"},
          {code: "45018", msg: "too many group now, no need to add new", remark: "组数量过多"},
          {code: "50001", msg: "api unauthorized", remark: "接口未授权"}
        ]
      }
    },
    methods: {
      testSearch(item) {
        let {search} = this;
        return item.code.indexOf(search) > -1 || item.msg.indexOf(search) > -1 || item.remark.indexOf(search) > -1;
      },
    },
  }
</script>

<style scoped lang="less">
  .search {
    margin: 2rem 0;
    padding: .5rem;
    background-color: rgba(255, 255, 255, .7);
    border-bottom: .06rem #f5f5f5 solid;
  }
  .err-code {
    max-width: 50rem;
    font-size: 1rem;
    line-height: 2;
    box-shadow: .1rem .1rem .2rem #aaa;
  }

  .item {
    padding: 0 10px;
    background-color: #fff;
    &:nth-child(2n) {
      background-color: #f5f5f5;
    }
  }
</style>