<template>
  <el-upload
    class="avatar-uploader"
    action="https://jsonplaceholder.typicode.com/posts/"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <el-icon-plus v-else class="avatar-uploader-icon"
      ><Plus class="icon-plus" width="50" height="50"
    /></el-icon-plus>
  </el-upload>
</template>

<script>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

export default {
  name: "avatarUpload123",
  components: { Plus },
  props: {
    imgUrl: String,
  },
  setup(props, ctx) {
    const imageUrl = ref(props.imgUrl);

    /**
     * 上传完成
     */
    const handleAvatarSuccess = (res, file) => {
      imageUrl.value = URL.createObjectURL(file.raw);
      console.log(file);
      //   ctx.emit("changeImage", newHtml);
    };
    const beforeAvatarUpload = file => {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        ElMessage.error("Avatar picture must be JPG format!");
      }
      if (!isLt2M) {
        ElMessage.error("Avatar picture size can not exceed 2MB!");
      }
      return isJPG && isLt2M;
    };
    return {
      handleAvatarSuccess,
      beforeAvatarUpload,
    };
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 150px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.el-icon.avatar-uploader-icon {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
.el-icon.avatar-uploader-icon .icon-plus {
  width: 18px;
  height: 18px;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
