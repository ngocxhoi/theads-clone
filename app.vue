<template>
  <VitePwaManifest />

  <div class="bg-black fixed w-[calc(100%+1px)] h-full">
    <NuxtPage />

    <Model
      :class="[
        {
          'max-h-screen transition-all duration-200 ease-in visible':
            userStore.isLogoutOverlay,
        },
        {
          'max-h-0 transition-all duration-200 ease-out invisible':
            !userStore.isLogoutOverlay,
        },
      ]"
    />
    <UNotifications />
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore();
</script>

<style></style>
