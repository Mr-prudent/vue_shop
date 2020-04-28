<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDiolag">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
        :show-row-hover="false"
        class="tree-table"
      >
        <!-- 是否有效 -->
        <template #isok="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false"
           style="color: green"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template #order="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success" size="mini">二级</el-tag>
          <el-tag v-else type="warning" size="mini">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template #opt="scope">
          <el-button type="primary" icon="el-icon-edit"
          @click="editCateDialog(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete"
          @click="deleteCateDialog(scope.row)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 8, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="40%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormrules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options指定数据源 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除对话框 -->
    <el-dialog title="提示" :visible.sync="deleteCateDialogVisible" width="30%">
      <span>是否删除该分类？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editCateDialogVisible" width="40%">
      <el-form ref="editCateFormRef" :model="toEditCate" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="toEditCate.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getCateList();
  },
  name: 'Cate',
  data() {
    return {
      catelist: [],
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 3,
      },
      total: 0,
      // 指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          type: 'template',
          // 模板名称
          template: 'isok',
        },
        {
          label: '排序',
          type: 'template',
          // 模板名称
          template: 'order',
        },
        {
          label: '操作',
          type: 'template',
          // 模板名称
          template: 'opt',
        },
      ],
      // 添加分类对话框的显示
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0,
      },
      addCateFormrules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      parentCateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: 'true',
      },
      selectedKeys: [],
      deleteCateDialogVisible: false,
      editCateDialogVisible: false,
      deletetoCate: {},
      toEditCate: {
        cat_name: '',
        cat_id: 0,
      },
      editCateForm: {},
    };
  },
  methods: {
    // 获取商品分类列表
    getCateList() {
      this.$http({
        method: 'get',
        params: this.queryInfo,
        url: '/categories',
      }).then((res) => {
        const { data: resData } = res;
        if (resData.meta.status !== 200) {
          return this.$message.error('获取失败');
        }
        this.catelist = resData.data.result;
        this.total = resData.data.total;
        return true;
      });
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    showAddCateDiolag() {
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    // 获取父级分类的数据列表
    getParentCateList() {
      this.$http({
        method: 'get',
        url: '/categories',
        params: {
          type: 2,
        },
      })
        // eslint-disable-next-line consistent-return
        .then((res) => {
          const { data: resData } = res;
          if (resData.meta.status !== 200) {
            return this.$message.error('获取失败');
          }
          this.parentCateList = resData.data;
        })
        .catch((err) => err);
    },
    // 选择项发生变化时触发的函数
    parentCateChange() {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        this.addCateForm.cat_level = this.selectedKeys.length;
        return true;
      }
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
      return true;
    },
    addCate() {
      // eslint-disable-next-line consistent-return
      this.$refs.addCateFormRef.validate((valid) => {
        if (!valid) return false;
        this.$http({
          method: 'post',
          url: '/categories',
          data: this.addCateForm,
        })
          // eslint-disable-next-line consistent-return
          .then((res) => {
            const { data: resData } = res;
            if (resData.meta.status !== 201) {
              this.$message.error('添加失败');
              return false;
            }
            this.$message.success('添加成功');
            this.getCateList();
            this.addCateDialogVisible = false;
          })
          .catch((err) => err);
      });
    },
    // 对话框关闭事件
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },
    deleteCateDialog(data) {
      this.deleteCateDialogVisible = true;
      this.deletetoCate = data;
    },
    deleteCate() {
      this.$http({
        method: 'delete',
        url: `categories/${this.deletetoCate.cat_id}`,
      })
        .then((res) => {
          const { data: resData } = res;
          if (resData.meta.status !== 200) {
            return false;
          }
          this.$message.success('删除成功');
          this.getCateList();
          this.deleteCateDialogVisible = false;
          return true;
        })
        .catch((err) => err);
    },
    editCateDialog(data) {
      this.editCateDialogVisible = true;
      this.toEditCate = data;
    },
    editCate() {
      this.$http({
        url: `/categories/${this.toEditCate.cat_id}`,
        method: 'put',
        data: {
          cat_name: this.toEditCate.cat_name,
        },
      }).then((res) => {
        const { data: resData } = res;
        if (resData.meta.status !== 200) {
          return this.$message.error('编辑失败');
        }
        this.$message.success('编辑成功');
        this.getCateList();
        this.editCateDialogVisible = false;
        return true;
      }).catch((err) => err);
    },
  },
};
</script>

<style scoped>
.tree-table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
