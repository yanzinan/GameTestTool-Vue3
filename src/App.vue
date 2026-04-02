<template>
  <n-layout>
      <!-- 全局 Loading 只放一次 -->
      <Loading ref="loadingRef" />
      <n-dialog-provider>
        <n-modal-provider>
          <router-view />
        </n-modal-provider>
      </n-dialog-provider>
      
  </n-layout>
</template>

<script setup>
  import { ref, onMounted } from 'vue'

  // 获取 Loading 组件实例
  const loadingRef = ref(null)

  onMounted(() => {
    // 把 show / hide 挂载到全局，方便任何地方调用
    window.$showLoading = () => loadingRef.value?.showLoading()
    window.$hideLoading = () => loadingRef.value?.hideLoading()
  })
</script>