<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" style="width: 700px;height:500px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts';
// eslint-disable-next-line no-unused-vars
import _ from 'lodash';

export default {
  created() {

  },
  // 钩子函数，dom元素初始化完毕
  mounted() {
    const myChart = echarts.init(document.getElementById('main'));
    this.$http({
      method: 'get',
      url: '/reports/type/1',
    }).then((res) => {
      const { data: resData } = res;
      if (resData.meta.status !== 200) {
        return false;
      }
      const result = _.merge(resData.data, this.options);
      myChart.setOption(result);
      return true;
    }).catch((err) => err);
  },
  data() {
    return {
      options: {
        title: {
          text: '用户来源',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
      },
    };
  },
  methods: {

  },
};
</script>

<style lang="less" scoped>
</style>
