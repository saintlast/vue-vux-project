<template>
    <common-layout class="delivery-layout" :tabs="tabs">
    </common-layout>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import CommonLayout from '@/common/layout'
export default {
    name: 'deliveryLayout',
    title: '配送布局页面',
    data() {
        return {
            tabs: Object.freeze([])
        }
    },
    components: {
        CommonLayout
    },
    async created() {
        if (!this.shopSid) {
        this.$router.push({ name: 'platform' })
        } else {
            let _shopInfo = await this.getShopInfo()
            this.tabs = Object.freeze([
                {
                    id: 1,
                    title: '首页',
                    link: { name: 'deliveryHome' },
                    icon: 'icon-home'
                },
                {
                    id: 2,
                    title: '订单',
                    link: { name: 'deliveryOrderList', query: { by_deliver: 1 } },
                    icon: 'icon-text'
                },
                {
                    id: 3,
                    title: '客户',
                    link: { name: 'deliveryBusinessList' },
                    icon: 'icon-shop'
                }
            ])
        }
    },
    computed: {
        ...mapGetters(['shopSid'])
    },
    methods: {
        ...mapActions(['getShopInfo'])
    }
}

</script>
<style lang="scss" scoped>

</style>
