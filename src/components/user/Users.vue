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
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
        <el-col :span="7"></el-col>
      </el-row>
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态" align="center">
          <!-- 作用域插槽 -->
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state"
             @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px" align="center">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"
                      @click="removeUserById(scope.row.id)">
            </el-button>
            <el-tooltip
              class="item"
              effect="light"
              content="修改权限"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[ 1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form
        ref="addFormRef"
        :model="addForm"
        label-width="70px"
        :rules="addFormRules"
        :status-icon="true"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form ref="editFormRef" :model="editForm" label-width="70px" :rules="editFormRules">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList();
  },
  name: 'Users',
  data() {
    const checkEmail = (rules, value, cb) => {
      // 验证邮箱
      const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error('请输入合法邮箱'));
      return false;
    };
    const checkMobile = (rules, value, cb) => {
      // 验证手机号
      const regMobile = /^1[3456789]\d{9}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error('请输入合法手机号'));
      return false;
    };
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3-10个字符之间',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '用户名的长度在6-15个字符之间',
            trigger: 'blur',
          },
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur',
          },
          {
            validator: checkEmail,
          },
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur',
            validator: checkMobile,
          },
          {
            validator: checkMobile,
          },
        ],
      },
      editForm: {},
      editFormRules: {
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur',
          },
          {
            validator: checkEmail,
          },
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur',
          },
          {
            validator: checkMobile,
          },
        ],
      },
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
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    userStateChange(userInfo) {
      this.$http
        .put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
        .then((res) => {
          const { data: resData } = res;
          if (resData.meta.status === 200) {
            this.$message.success('更新状态成功');
          } else {
            this.$message.error('更新状态失败 ');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    addUser() {
      // eslint-disable-next-line consistent-return
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) {
          return false;
        }
        this.$http({
          method: 'post',
          url: '/users',
          data: this.addForm,
        })
          .then((res) => {
            const { data: resData } = res;
            if (resData.meta.status !== 201) {
              this.$message.error('添加失败');
              return false;
            }
            this.$message.success('添加成功');
            this.addDialogVisible = false;
            this.getUserList();
            return true;
          })
          .catch((err) => {
            console.log(err);
            return false;
          });
      });
    },
    showEditDialog(id) {
      this.$http({
        method: 'get',
        url: `/users/${id}`,
      })
        // eslint-disable-next-line consistent-return
        .then((res) => {
          const { data: resData } = res;
          if (resData.meta.status !== 200) {
            this.$message.error('请求失败');
            return false;
          }
          this.editForm = resData.data;
          this.editDialogVisible = true;
        })
        .catch((err) => {
          console.log(err);
          return false;
        });
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    editUserInfo() {
      // eslint-disable-next-line consistent-return
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return false;
        // 发送修改用户的网络请求
        this.$http({
          method: 'put',
          url: `/users/${this.editForm.id}`,
          data: {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          },
        }).then((res) => {
          const { data: resData } = res;
          if (resData.meta.status !== 200) {
            return this.$message.error('更新失败!');
          }
          // 关闭对话框
          this.editDialogVisible = false;
          // 刷新数据列表
          this.getUserList();
          // 提示修改成功
          return this.$message.success('更新成功！');
        }).catch((err) => {
          console.log(err);
        });
      });
    },
    removeUserById(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$http({
          method: 'delete',
          url: `/users/${id}`,
        }).then((res) => {
          const { data: resData } = res;
          if (resData.meta.status !== 200) {
            return this.$message.error('删除用户失败');
          }
          return true;
        }).catch((err) => err);
        this.$message({
          type: 'success',
          message: '删除成功!',
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
      this.getUserList();
    },
  },
};
</script>

<style>
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
.el-pagination {
  margin-top: 15px;
  margin-left: 240px;
}
</style>
