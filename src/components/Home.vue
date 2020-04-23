<template>

  <el-container class="home-container">
    <!-- 头部 -->
      <el-header>
        <div>
          <img src="../assets/heima.png" alt="">
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
        </el-header>
    <!-- 页面主题 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isColl ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区 -->
        <el-menu
              background-color="#333744"
              text-color="#fff"
              active-text-color="#409eff"
              :unique-opened = "true"
              :collapse = "isColl"
              :collapse-transition = "false"
              :router="true"
              :default-active="activepath"
              >
              <!-- 一级菜单 -->
            <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
              <!-- 一级菜单的模板区 -->
                <template slot="title">
                  <!-- 图标 -->
                  <i :class="iconsObj[item.id]"></i>
                  <span>{{item.authName}}</span>
               </template>
              <!-- 二级菜单 -->
              <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children"
                            :key="subItem.id" @click="saveNavState('/'+subItem.path)">
                <template slot="title">
                 <i class="el-icon-menu"></i>
                 <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>

export default {
  created() {
    this.getMenuList();
    this.activepath = window.sessionStorage.getItem('activepath');
  },
  name: 'Home',
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.replace('/login');
    },
    // 获取菜单
    getMenuList() {
      this.$http.get('/menus')
        .then((res) => {
          const { data: resData } = res;
          this.menulist = resData.data;
          console.log(this.menulist);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 折叠菜单
    toggleCollapse() {
      this.isColl = !this.isColl;
    },
    // 保存route
    saveNavState(activepath) {
      window.sessionStorage.setItem('activepath', activepath);
      this.activepath = activepath;
    },
  },
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      iconsObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      isColl: false,
      activepath: '',
    };
  },
};
</script>

<style lang="less" scoped>
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    padding-right: 10px;
    color: #ffffff;
    font-size: 18px;
    > div {
      display: flex;
      align-items: center;
      span {
        margin-left: 15px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
  }
  .el-main {
    background-color: #eaedf1;
  }
  .home-container {
    height: 100%;
  }
  .el-submenu {
    width: 200px;
  }

  .iconfont {
    margin-right: 10px;
    font-size: 20px;
  }
  .toggle-button {
    background-color: #4a5064;
    text-align: center;
    font-size: 10px;
    line-height: 24px;
    color: #ffffff;
    letter-spacing: 0.5em;
    cursor: pointer;
  }
</style>
