<template>
  <!-- 全屏遮罩 -->
  <div v-show="visible" class="loading-mask">
    <div class="loading-spinner">
      <!-- 加载动画 -->
      <div class="spinner"></div>
      <p class="text">加载中...</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 控制显示隐藏
const visible = ref(false)

// 暴露方法给全局调用
const showLoading = () => (visible.value = true)
const hideLoading = () => (visible.value = false)

// 把方法挂载到全局
defineExpose({ showLoading, hideLoading })
</script>

<style scoped>
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7); /* 半透明黑遮罩 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* 最高层级 */
}

.loading-spinner {
  text-align: center;
  color: #fff;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 12px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.text {
  font-size: 14px;
  margin: 0;
}
</style>