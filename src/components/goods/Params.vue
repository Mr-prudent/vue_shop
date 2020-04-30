<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 头部警告 -->
      <el-alert title="注意：只允许为第三级设置相关参数！" type="warning" :closable="false"></el-alert>
      <!-- 选择商品分类 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 商品分类级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="catelist"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible=true"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i,scope.row)"
                >{{item}}</el-tag>
                <!-- 可输入的TAG -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible=true"
          >添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i,scope.row)"
                >{{item}}</el-tag>
                <!-- 可输入的TAG -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params',
  created() {
    // 获取商品分类
    this.getCateList();
  },
  methods: {
    getCateList() {
      this.$http({
        method: 'get',
        url: '/categories',
      }).then((res) => {
        const { data: resData } = res;
        if (resData.meta.status !== 200) {
          return this.$message.error('获取失败');
        }
        this.catelist = resData.data;
        return true;
      }).catch((err) => err);
    },
    // 级联选择框变化触发的函数
    handleChange() {
      this.getParamsData();
    },
    handleClick() {
      this.getParamsData();
    },
    getParamsData() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return false;
      }
      // 选中了三级分类
      this.$http({
        method: 'get',
        url: `/categories/${this.cateId}/attributes`,
        params: {
          sel: this.activeName,
        },
      }).then((res) => {
        const { data: resData } = res;
        if (resData.meta.status !== 200) {
          this.$message.error('获取失败');
          return false;
        }
        resData.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : [];
          // 控制文本框的显示与隐藏
          item.inputVisible = false;
          item.inputValue = '';
        });
        if (this.activeName === 'many') {
          this.manyTableData = resData.data;
        } else {
          this.onlyTableData = resData.data;
        }
        return true;
      }).catch((err) => err);
      return true;
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    addParams() {
      // eslint-disable-next-line consistent-return
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return false;
        this.$http({
          method: 'post',
          url: `/categories/${this.cateId}/attributes`,
          data: {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          },
        }).then((res) => {
          const { data: resData } = res;
          if (resData.meta.status !== 201) {
            this.$message.error('添加参数失败');
            return false;
          }
          this.$message.success('添加参数成功');
          this.addDialogVisible = false;
          this.getParamsData();
          return true;
        }).catch((err) => err);
      });
    },
    // eslint-disable-next-line camelcase
    showEditDialog(id) {
      this.editDialogVisible = true;
      this.$http({
        method: 'get',
        url: `categories/${this.cateId}/attributes/${id}`,
        params: {
          attr_sel: this.activeName,
        },
      }).then((res) => {
        const { data: resData } = res;
        if (resData.meta.status !== 200) {
          return this.$message.error('获取失败');
        }
        this.editForm = resData.data;
        return true;
      }).catch((err) => err);
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    editParams() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return false;
        this.$http({
          method: 'put',
          url: `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          data: {
            attr_name: this.editForm.attr_name,
            attr_sel: this.editForm.attr_sel,
          },
        }).then((res) => {
          const { data: resData } = res;
          if (resData.meta.status !== 200) {
            return false;
          }
          this.$message.success('修改成功');
          this.getParamsData();
          this.editDialogVisible = false;
          return true;
        });
        return true;
      });
    },
    removeParams(id) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$http({
          method: 'delete',
          url: `categories/${this.cateId}/attributes/${id}`,
        }).then((res) => {
          const { data: resData } = res;
          if (resData.meta.status !== 200) {
            return this.$message.error('删除失败');
          }
          this.$message.success('删除成功');
          this.getParamsData();
          return false;
        }).catch((err) => err);
      }).catch((err) => err);
    },
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = '';
        row.inputVisible = false;
        return false;
      }
      row.attr_vals.push(row.inputValue.trim());
      this.saveAttrVales(row);
      row.inputValue = '';
      row.inputVisible = false;
      return true;
    },
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrVales(row);
    },
    saveAttrVales(row) {
      this.$http({
        method: 'put',
        url: `/categories/${this.cateId}/attributes/${row.attr_id}`,
        data: {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(','),
        },
      }).then((res) => {
        const { data: resData } = res;
        if (resData.meta.status !== 200) {
          return this.$message.error('修改参数失败');
        }
        return this.$message.success('修改参数成功');
      }).catch((err) => err);
    },
  },
  data() {
    return {
      catelist: [],
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      selectedCateKeys: [],
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      addDialogVisible: false,
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
        ],
      },
      addForm: {},
      editForm: {},
      editDialogVisible: false,
    };
  },
  computed: {
    // 按钮禁用
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    // 三级分类id
    // eslint-disable-next-line vue/return-in-computed-property
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数';
      }
      return '静态属性';
    },
  },
};
</script>
;
<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 80px;
}
</style>
