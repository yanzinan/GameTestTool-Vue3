import { defineStore, createPinia } from 'pinia'

// 创建 pinia 实例
const pinia = createPinia()
export default pinia

// 全局通用 store
export const useGlobalStore = defineStore('global', {
  state: () => ({
    token: '',
    slotsInit:null,
    id:null,
    difficulty:'',
    hard_limit_seconds:300,
    history_events_limit:14
  }),
  actions: {
    // 保存 token
    setToken(token) {
      this.token = token
    },
    // 存储slots
    setSlots(slotsData){
      this.slotsInit = slotsData;
    },
    // 存储游戏id
    setGameId(id){
      this.id = id;
    },
    // 存储游戏难度
    setGameDifficulty(type){
      this.difficulty = type;
    }
  }
})