<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="logo_img">
      </div>
      <el-form ref="loginFormRef" label-width="0px" class="login_form" :model="loginForm"
              :rules="loginFormRules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="el-icon-lock" v-model="loginForm.password">
          </el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      // 验证规则对象
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur',
          },
        ],
      },
    };
  },
  methods: {
    resetForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate()
        .then(() => {
          this.$http({
            method: 'post',
            url: '/login',
            data: this.loginForm,
          })
            .then((response) => new Promise((resolve) => {
              const { data: resData } = response;
              resolve(resData);
            }))
            .then((resData) => {
              if (resData.meta.status !== 200) {
                return this.$message.error('登录失败');
              }
              this.$message.success('登录成功');
              window.sessionStorage.setItem('token', resData.data.token);
              this.$router.push('/home');
              return true;
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((err) => {
          console.log(err);
          return -1;
        });
    },
  },
};
</script>

<style lang="less" scoped>
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #ffffff;
    border-radius: 5px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);

    .avatar_box {
      height: 130px;
      width: 130px;
      border: 1px solid #eeeeee;
      border-radius: 50%;
      padding: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 0 5px #dddddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
      background-color: #ffffff;
      img {
        width: 110px;
        height: 110px;
        border-radius: 50%;
        background-color: #eeeeee;
      }
    }
    .btns {
      display: flex;
      justify-content: flex-end;

    }
    .login_form {
      position: absolute;
      bottom:  0;
      width: 100%;
      padding: 0 40px;
      box-sizing: border-box;
    }
  }
</style>
