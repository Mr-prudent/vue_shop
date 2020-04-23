<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索与添加  -->
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
        <el-col :span="7"></el-col>
      </el-row>
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态"></el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList();
  },
  name: 'Users',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: '1',
        pagesize: '2',
      },
      userList: [],
      total: 0,
    };
  },
  methods: {
    getUserList() {
      this.$http({
        method: 'get',
        url: '/users',
        params: this.queryInfo,
      })
        .then((res) => {
          const { data: resData } = res;
          this.userList = resData.data.users;
          this.total = resData.data.total;
          console.log(this.userList, this.total);
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('err');
        });
    },
  },
};
</script>

<style>
  .el-table {
    margin-top: 15px;
    font-size: 12px;
  }
</style>
