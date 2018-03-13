<template>
  <div class="delivery-home">
    <div class="search-sort-bar vux-flexbox">
        <selector :options="['订单', '商户']" v-model="selectTabs"></selector>
            <div class="search flex-one ml10" @click="showSearchBar=true">
               
                <div class="search-input ellipsis">
                    <i class="iconfont icon-search"></i>
                    <span class="fc-9">
                        {{searchPlaceholder}}
                    </span>
                </div>
            </div>
            <div class="filter pl10 pr5" @click="toQrScan">
                <i class="iconfont icon-scan"></i>
            </div>
        </div>
        <gc-search history-key="goodsList" :word.sync="keyword" v-model="showSearchBar" :search-fn="onSearch" :placeholder="searchPlaceholder"></gc-search>
    <grid class="tc bc-f" :rows="4">
      <grid-item @click.native="goDeliveryOrderList">
        <i class="iconfont icon-text fs20"></i>
        <p>订单</p>
      </grid-item>
      <grid-item @click.native="goDeliveryBusinessList">
        <i class="iconfont icon-shop fs20"></i>
        <p>商户</p>
      </grid-item>
      <grid-item @click.native="goUc">
        <i class="iconfont icon-people fs20"></i>
        <p>管理中心</p>
      </grid-item>
      <grid-item @click.native="goPlatform">
        <i class="iconfont icon-home fs20"></i>
        <p>返回平台</p>
      </grid-item>
    </grid>

    <group class="gc-cells">
      <div class="gc-cell">
        <div class="box-flex align-item">
          <i class="iconfont f-theme icon-text fs40 mr10"></i>
          <div class="flex-one">
            <div>今日收发</div>
            <div>{{userDeliverHomeData.day_orders}}单（已接{{userDeliverHomeData.day_orders_get}}，待接{{userDeliverHomeData.day_orders - userDeliverHomeData.day_orders_get}}）</div>
          </div>
          <span>{{userDeliverHomeData.day_orders_rate}}%</span>
        </div>
      </div>
    </group>
    <group class="gc-cells">
      <div class="box-flex gc-cell tc">
        <div class="flex-one">
          本周收发<br/> {{userDeliverHomeData.week_orders}}单
        </div>
        <div class="flex-one">
          本月收发<br/> {{userDeliverHomeData.month_orders}}单
        </div>
      </div>
    </group>
    <group class="gc-cells">
      <div class="vux-flexbox gc-cell tc" v-for="(shipper,index) in userDeliverHomeData.shipper_todo" :key="index">
        <div class="flex-one">
          {{shipper.name}}
        </div>
        <div class="flex-one">
          {{shipper.orders}}单未接
        </div>
      </div>
    </group>
    <group class="gc-cells">
      <div class="sort-tab">
        <tab :line-width="1" custom-bar-width="60px">
          <tab-item :selected="days==0" @click.native="tabClick(0)">当天</tab-item>
          <tab-item :selected="days==1" @click.native="tabClick(1)">昨天</tab-item>
          <tab-item :selected="days==7" @click.native="tabClick(7)">本周</tab-item>
          <tab-item :selected="days==30" @click.native="tabClick(30)">本月</tab-item>
        </tab>
      </div>
      <div class="record-box">
        <p>
          对接商户：{{userDeliverStatData.shipper_count}}家
        </p>
        <p>
          订单收发：{{userDeliverStatData.order_count}}单
        </p>
        <p>
          <!-- 总计金额：{{userDeliverStatData.money_sum}}元 -->
        </p>
      </div>
    </group>
  </div>
</template>
<script>
import {
  mapGetters,
  mapActions
} from 'vuex'
import GcSearch from '@/common/search'
import { scanQr } from '@/utils'
export default {
  name: 'delivery-home',
  title: '搬运首页',
  components: {
    GcSearch
  },
  data() {
    return {
      userDeliverHomeData: {},
      userDeliverStatData: {},
      days: 0,
      showSearchBar:false,
      keyword:'',
      selectTabs:'订单'
    }
  },
  computed: {
    ...mapGetters(['userSid']),
    searchPlaceholder(){
      let text = ''
      switch (this.selectTabs){
        case '订单':
        text = '订单号/收货人';
        break;
        case '客户':
        text = '客户名称';
        break;
        case '上游':
        text = '上游名称';
        break;
        case '商品':
        text = '商品名称/品牌/货号';
        break;
      }
      return text;
    }
  },
  created() {
    this.getUserDeliverHomeData();
    this.getUserDeliverStatData(this.days)
  },
  methods: {
    goDeliveryOrderList() {
      this.$router.push({ name: 'deliveryOrderList', query: { by_deliver: 1 } })
    },
    goPlatform() {
      this.$router.push({ name: 'platform' })
    },
    goUc() {
      this.$router.push({ name: 'deliveryUc' })
    },
    goDeliveryBusinessList() {
      this.$router.push({ name: 'deliveryBusinessList' })
    },
    goSwitch() {
      this.$bus.$emit('$$goManageSysCheck', { from: 'business', iSswitch: true })
    },
    goGeolocation() {
      this.$geolocation()
    },
    async getUserDeliverHomeData() {
      let _result = await this.$api.userDeliverHome()
      if (_result) {
        this.userDeliverHomeData = _result;
      }
    },
    async getUserDeliverStatData(days) {
      let _result = await this.$api.userDeliverStat(days)
      if (_result) {
        this.userDeliverStatData = _result;
      }
    },
    // tab切事件
    tabClick(days) {
      this.days = days
      this.getUserDeliverStatData(days)
    },
     //筛选确定
      onSearch() {
        switch (this.selectTabs){
          case '订单':
          this.$router.push({
            name:'businessOrderList',
            query:{
              keyword:this.keyword
            }
          })
          break;
          case '商户':
           this.$router.push({
            name:'businessCustomer',
            query:{
              keyword:this.keyword
            }
          })
          break;
        }
      },
      toQrScan() {
        scanQr()
      },
  }
}
</script>
<style lang="scss" scoped>
@import '../../style/scss/_mixin.scss';
@import '../../style/scss/_common.scss';
.delivery-home {}

.align-item {
  align-items: center
}

.fs40 {
  font-size: 40px;
}

.fs32 {
  font-size: 32px;
}

.gc-cell {
  line-height: 1.8;
}

.record-box {
  padding: 15px;
  p {
    line-height: 30px;
  }
}


.search-sort-bar {
    height: 44px;
    position: fixed;
    top:0;
    z-index:10;
    width: 100%;
    background-color: $theme;
    .iconfont {
        font-size: 22px;
        color:#fff;
    }
  
    .category {}
    .search {
        border: 1px solid #fff;
        border-radius: 20px;
        background-color: #fff;
        padding: 4px 10px;
        .search-input {
            padding-right: 15px;
            .iconfont {
                font-size: 15px;
                color:#666
            }
            span {}
        }
    }
}
</style>