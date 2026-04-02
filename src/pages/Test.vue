<template>
  <div>
    <h1>测试页</h1>
    <n-button @click="goBack">返回首页</n-button>
    
    <!-- 使用全局状态 -->
    <p>Token：{{ globalStore.token }}</p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useGlobalStore } from '../store'

const router = useRouter()
const globalStore = useGlobalStore()

const goBack = () => {
  router.push('/')
}
</script>