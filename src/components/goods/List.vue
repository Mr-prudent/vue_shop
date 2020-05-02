<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddGoodsPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="90px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="90px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="160px">
          <template v-slot="scope">{{scope.row.add_time | dataFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

  </div>
</template>

<script>
export default {
  name: 'List',
  created() {
    this.getGoodsList();
  },
  methods: {
    // 获取商品列表
    getGoodsList() {
      this.$http.get('/goods', { params: this.queryInfo }).then((res) => {
        const { data: resData } = res;
        if (resData.meta.status !== 200) {
          return false;
        }
        this.goodslist = resData.data.goods;
        this.total = resData.data.total;
        return true;
      }).catch((err) => err);
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    removeById(id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$http({
          method: 'delete',
          url: `/goods/${id}`,
        }).then((res) => {
          const { data: resData } = res;
          if (resData.meta.status !== 200) {
            this.$message.error('删除失败');
          }
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
          this.getGoodsList();
        }).catch((err) => err);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
    },
    goAddGoodsPage() {
      this.$router.push('/goods/add');
    },
  },
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      goodslist: [],
      total: 0,
    };
  },
};
</script>

<style lang="less" scoped>
</style>
