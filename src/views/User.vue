<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>基础信息</span>
            </div>
          </template>
          <div class="info">
            <div class="info-avatarBox">
              <AvatarUpload
                :imageUrl="showAvatarUrl || ''"
                @changeImage="changeImage"
              />
            </div>
            <!-- <div class="info-image" @click="showDialog">
              <img :src="avatarImg" />
              <span class="info-edit">
                <i class="el-icon-lx-camerafill"></i>
              </span>
            </div> -->
            <div class="info-name">{{ userInfoData.name }}</div>
            <el-tag>{{
              userInfoData.type === "SUPPER_ADMIN" ? "超级管理员" : "普通管理员"
            }}</el-tag>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>账户编辑</span>
            </div>
          </template>
          <el-form label-width="90px">
            <el-form-item label="用户名：">
              {{ userInfoData.name }}
            </el-form-item>
            <el-form-item label="手机号：">
              {{ userInfoData.phone }}
            </el-form-item>
            <el-form-item label="旧密码：">
              <el-input type="password" v-model="form.oldPwd"></el-input>
            </el-form-item>
            <el-form-item label="新密码：">
              <el-input type="password" v-model="form.newPwd"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="裁剪图片" v-model="dialogVisible" width="600px">
      <vue-cropper
        ref="cropper"
        :src="imgSrc"
        :ready="cropImage"
        :zoom="cropImage"
        :cropmove="cropImage"
        style="width: 100%; height: 400px"
      ></vue-cropper>

      <template #footer>
        <span class="dialog-footer">
          <el-button class="crop-demo-btn" type="primary"
            >选择图片
            <input
              class="crop-input"
              type="file"
              name="image"
              accept="image/*"
              @change="setImage"
            />
          </el-button>
          <el-button type="primary" @click="saveAvatar">上传并保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from "vue";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import avatar from "../assets/img/img.jpg";
import { useStore } from "vuex";
import md5 from "md5";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { updateAdminSelf } from "../api/index";
import AvatarUpload from "../components/AvatarUpload.vue";

export default {
  name: "user",
  components: {
    VueCropper,
    AvatarUpload,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const form = ref({
      oldPwd: "",
      newPwd: "",
    });
    const showAvatarUrl = ref("");

    const avatarImg = ref(avatar);
    const userInfoData = ref("");
    const imgSrc = ref("");
    const cropImg = ref("");
    const dialogVisible = ref(false);
    const cropper = ref(null);

    const onSubmit = async () => {
      const { oldPwd, newPwd } = form.value;
      if (userInfoData.value.pwd !== md5(oldPwd)) {
        ElMessage.info("旧密码错误");
        return;
      }
      if (!newPwd) {
        ElMessage.info("新密码不能为空");
        return;
      }
      const res = await updateAdminSelf({ ...userInfoData.value, pwd: newPwd });
      if (!res.success) {
        ElMessage.info(res.message);
        return;
      }
      ElMessage.success("修改密码成功，请重新登录");
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      router.push("/login");
    };

    // 图片变更
    const changeImage = async(data) => {
      const { absolutePath, name } = data;
      showAvatarUrl.value = absolutePath;
      const res = await updateAdminSelf({
        ...userInfoData.value,
        avatarUrl: name,
      });
      if (!res.success) {
        ElMessage.info(res.message);
        return;
      }
      ElMessage.success("修改头像成功");
      store.commit("updateUserInfo", {
        ...userInfoData.value,
        avatarUrl: absolutePath,
      });
    };

    onMounted(() => {
      const { userInfo } = store.state;
      userInfoData.value = userInfo;
      showAvatarUrl.value = userInfo.avatarUrl;
    });

    const showDialog = () => {
      dialogVisible.value = true;
      imgSrc.value = avatarImg.value;
    };

    const setImage = (e) => {
      const file = e.target.files[0];
      if (!file.type.includes("image/")) {
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        dialogVisible.value = true;
        imgSrc.value = event.target.result;
        cropper.value && cropper.value.replace(event.target.result);
      };
      reader.readAsDataURL(file);
    };

    const cropImage = () => {
      cropImg.value = cropper.value.getCroppedCanvas().toDataURL();
    };

    const saveAvatar = () => {
      avatarImg.value = cropImg.value;
      dialogVisible.value = false;
    };

    return {
      form,
      onSubmit,
      cropper,
      avatarImg,
      userInfoData,
      imgSrc,
      cropImg,
      showDialog,
      dialogVisible,
      setImage,
      cropImage,
      saveAvatar,
      showAvatarUrl,
      changeImage,
    };
  },
};
</script>

<style scoped>
.info {
  text-align: center;
  padding: 35px 0;
}
.info-avatarBox {
  display: flex;
  justify-content: center;
}
.info-image {
  position: relative;
  margin: auto;
  width: 100px;
  height: 100px;
  background: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 50px;
  overflow: hidden;
}
.info-image img {
  width: 100%;
  height: 100%;
}
.info-edit {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.info-edit i {
  color: #eee;
  font-size: 25px;
}
.info-image:hover .info-edit {
  opacity: 1;
}
.info-name {
  margin: 15px 0 10px;
  font-size: 24px;
  font-weight: 500;
  color: #262626;
}
.crop-demo-btn {
  position: relative;
}
.crop-input {
  position: absolute;
  width: 100px;
  height: 40px;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
</style>