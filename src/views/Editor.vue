<template>
  <div>
    <div class="container">
      <!-- <div class="plugins-tips">
                wangEditor：轻量级 web 富文本编辑器，配置方便，使用简单。
                访问地址：
                <a href="https://www.wangeditor.com/doc/" target="_blank">wangEditor</a>
            </div> -->
      <div class="mgb20" ref="editor"></div>
      <!-- <el-button type="primary" @click="syncHTML">提交</el-button> -->
    </div>
  </div>
</template>

<script>
import WangEditor from "wangEditor";
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
export default {
  name: "editor",
  props: {
    content: Number,
  },
  setup(props, ctx) {
    const editor = ref(null);
    const content = reactive({
      html: "",
      text: "",
    });
    let instance;
    onMounted(() => {
      const { content } = props;

      instance = new WangEditor(editor.value);
      instance.config.zIndex = 1;
      // 配置 onchange 回调函数
      instance.config.onchange = function (newHtml) {
        // console.log("change 之后最新的 html", newHtml);
        ctx.emit("changeEditor", newHtml);
      };
      // 配置触发 onchange 的时间频率，默认为 200ms
      instance.config.onchangeTimeout = 500; // 修改为 500ms
      instance.create();
      console.log(content)
      instance.txt.html(content); // 重新设置编辑器内容
    });
    onBeforeUnmount(() => {
      instance.destroy();
      instance = null;
    });
    const syncHTML = () => {
      content.html = instance.txt.html();
      console.log(content.html);
    };
    return {
      syncHTML,
      editor,
      content,
    };
  },
};
</script>

<style>
</style>