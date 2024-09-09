<template>
  <transition name="fade">
    <div v-if="isVisible" class="popup-message">
      <p>{{ message }}</p>
    </div>
  </transition>
</template>

<script>
export default {
  props: ['message'],
  data() {
    return {
      isVisible: false
    };
  },
  watch: {
    message(newMessage) {
      if (newMessage) {
        this.showPopup();
      }
    }
  },
  methods: {
    showPopup() {
      this.isVisible = true;
      setTimeout(() => {
        this.isVisible = false;
      }, 3000);
    }
  }
};
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>

<style scoped>
.popup-message {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  font-size: 14px;
  max-width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .popup-message {
    right: 10px;
    bottom: 10px;
    max-width: 90%;
    padding: 8px 15px;
  }
}
</style>
