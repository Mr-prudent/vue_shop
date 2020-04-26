/* eslint-disable max-len */
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoledialog=true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="rolelist" border stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="[ 'bdbottom', i1 === 0 ? 'bdtop' : '','vcenter']"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <!-- // eslint-disable-next-line max-len -->
                <el-tag closable
                @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级 -->
              <el-col :span="19">
                <!-- 渲染二级权限 -->
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'bdtop','vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditRole(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRole(scope.row.id)"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="添加角色" :visible.sync="addRoledialog" width="30%">
      <!-- form表单 -->
      <el-form ref="addRloeRef" label-width="80px" :rules="addRoleRules" :model="addRolrForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolrForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolrForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoledialog = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色对话框 -->
    <el-dialog title="修改角色" :visible.sync="editRoledialog" width="30%">
      <!-- form表单 -->
      <el-form ref="editRloeRef" label-width="80px" :rules="addRoleRules" :model="editRoleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoledialog = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="40%">
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox node-key="id"
        :default-expand-all="true"
        :default-checked-keys="defKeys"
        ref="treeRef"
        ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getRolesList();
  },
  name: 'Roles',
  data() {
    return {
      // 所有角色的列表数据
      rolelist: [],
      addRoledialog: false,
      editRoledialog: false,
      addRolrForm: {
        roleName: '',
        roleDesc: '',
        id: 0,
      },
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '角色的长度在2-10个字符之间',
            trigger: 'blur',
          },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 2,
            max: 15,
            message: '角色描述的长度在2-15个字符之间',
            trigger: 'blur',
          },
        ],
      },
      editRoleForm: {},
      // 分配对话框的显示
      setRightDialogVisible: false,
      rightsList: [],
      // 树控件的属性
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      // 默认选中的属性
      defKeys: [],
      roleID: '',
    };
  },
  methods: {
    getRolesList() {
      this.$http({
        method: 'get',
        url: '/roles',
      })
        .then((res) => {
          const { data: resData } = res;
          if (resData.meta.status !== 200) {
            return this.$message.error('获取角色列表失败');
          }
          this.rolelist = resData.data;
          return true;
        })
        .catch((err) => err);
    },
    addRole() {
      // eslint-disable-next-line consistent-return
      this.$refs.addRloeRef.validate((valid) => {
        if (!valid) return false;
        this.$http({
          method: 'post',
          url: '/roles',
          data: this.addRolrForm,
          // eslint-disable-next-line consistent-return
        })
          .then((res) => {
            const { data: resData } = res;
            if (resData.meta.status !== 201) {
              return this.$message.error('添加失败');
            }
            this.$message.success('添加成功');
            this.addRoledialog = false;
            this.getRolesList();
            return true;
          })
          .catch((err) => err);
      });
    },
    showEditRole(info) {
      this.editRoleForm = info;
      this.editRoledialog = true;
    },
    editRole() {
      // eslint-disable-next-line consistent-return
      this.$refs.editRloeRef.validate((valid) => {
        if (!valid) return false;
        this.$http({
          method: 'put',
          url: `/roles/${this.editRoleForm.id}`,
          data: {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc,
          },
        })
          .then((res) => {
            const { data: resData } = res;
            if (resData.meta.status !== 200) {
              this.$message.error('修改失败');
              return false;
            }
            this.editRoledialog = false;
            this.getRolesList();
            return this.$message.success('修改成功');
          })
          .catch((err) => err);
      });
    },
    removeRole(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$http({
            method: 'delete',
            url: `roles/${id}`,
            // eslint-disable-next-line consistent-return
          }).then((res) => {
            const { data: resData } = res;
            if (resData.meta.status !== 200) {
              this.$message.error('删除失败');
              return false;
            }
            this.$message.success('删除成功');
            this.getRolesList();
            return true;
          });
        })
        .catch((err) => err);
    },
    removeRightById(role, rightId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$http({
            method: 'delete',
            url: `/roles/${role.id}/rights/${rightId}`,
          })
            .then((res) => {
              const { data: resData } = res;
              if (resData.meta.status !== 200) {
                this.$message.error('删除权限失败');
                console.log(resData.meta);
                return false;
              }
              this.$message.success('删除成功');
              // this.getRolesList();
              role.children = resData.data;
              return true;
            })
            .catch((err) => err);
        })
        .catch(() => {
          this.$message.info('取消删除');
          return false;
        });
    },
    showSetRightDialog(role) {
      this.roleID = role.id;
      this.$http({
        method: 'get',
        url: '/rights/tree',
      }).then((res) => {
        const { data: resData } = res;
        if (resData.meta.status !== 200) {
          this.$message.error('获取权限数据失败');
          return false;
        }
        this.rightsList = resData.data;
        this.defKeys = [];
        this.getLeafKeys(role, this.defKeys);
        this.setRightDialogVisible = true;
        return true;
      }).catch((err) => err);
    },
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
      return true;
    },
    // 分配权限
    allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(',');
      this.$http({
        method: 'post',
        url: `/roles/${this.roleID}/rights`,
        data: {
          rids: idStr,
        },
      }).then((res) => {
        const { data: resData } = res;
        if (resData.meta.status !== 200) {
          this.$message.error('分配权限失败');
          return false;
        }
        this.$message.success('分配权限成功');
        this.getRolesList();
        this.setRightDialogVisible = false;
        return true;
      }).catch((err) => err);
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eeeeee;
}

.bdbottom {
  border-bottom: 1px solid #eeeeee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
