import Vue from "vue";
import * as types from "./constant";
import apis from "@/api";
import wx from "weixin-js-sdk";
import {
  saveToLocal,
  loadFromLocal,
  removeFromLocal
} from "@/utils/localStorage";
const SID_KEY = "SID_KEY";

const state = {
  sid: loadFromLocal(SID_KEY),
  delivers: [],
  posts: [],
  shopInfo: null,
  shopSignInfo: null
};

const actions = {
  // 获取商铺信息
  async getShopInfo({ commit, state }) {
    let _shopInfo = await apis.shopGetDetail(state.sid)
    commit(types.SHOP_INFO, _shopInfo)
    return _shopInfo;
  },
  // 获取搬运列表
  async getDelivers({ commit, state }) {
    let _list = []
    let _result = await apis.manageGetDeliverList(state.sid)
    _result.list.forEach((item) => {
      let _item = {
        key: item.uid,
        value: item.uname
      }
      _list.push(_item)
    })
    commit(types.SHOP_DELIVERS, _list)
    return _list;
  },
  // 获取车队列表
  async getPosts({ commit, state }) {
    let _list = []
    return _list;
  },
  // 更新商铺信息
  updateShopInfo({ commit }, shopInfo) {
    commit(types.UPDATE_SHOP_INFO, shopInfo);
  },
  // 用户登录初始化sid验证(判断当前用户是否具有记录sid的shop)
  initSid({ dispatch, state }, sids) {
    if (!sids.includes(state.sid)) {
      removeFromLocal(SID_KEY);
      dispatch("setSid", "");
    }
  },
  // 设置商铺id
  setSid({ commit, getters, dispatch }, sid) {
    saveToLocal(SID_KEY, sid);
    if (sid || sid === 0) {
      let _shop = getters.userShops.find(s => s.sid === sid);
      dispatch("setShopSignInfo", _shop);
    }
    commit(types.SHOP_SID, sid);
  },
  //当前商铺认证信息
  setShopSignInfo({ commit }, shopSignInfo) {
    commit(types.SHOP_SIGN_INFO, shopSignInfo);
  },
};

const mutations = {
  [types.SHOP_INFO](state, payload) {
    state.shopInfo = payload;
  },
  [types.SHOP_DELIVERS](state, payload) {
    state.delivers = payload;
  },
  [types.SHOP_POSTS](state, payload) {
    state.posts = payload;
  },
  [types.UPDATE_SHOP_INFO](state, payload) {
    for (let key in payload) {
      if (state.shopInfo[key]) {
        Vue.set(state.shopInfo, key, payload[key]);
      }
    }
  },
  [types.SHOP_SID](state, payload) {
    state.sid = payload;
  },
  [types.SHOP_SIGN_INFO](state, payload) {
    state.shopSignInfo = payload;
  }
};

const getters = {
  shopInfo(state) {
    return state.shopInfo;
  },
  delivers(state) {
    return state.delivers;
  },
  posts(state) {
    return state.posts;
  },
  shopSid(state, getters) {
    return state.sid;
  },
  userSid(state, getters) {
    return state.sid;
  },
  shopSignInfo(state) {
    return state.shopSignInfo;
  }
};
export default {
  state,
  actions,
  mutations,
  getters
};
