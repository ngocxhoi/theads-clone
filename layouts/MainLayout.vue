<template>
  <div id="MainLayout" class="h-screen">
    <div class="w-full max-w-[500px] mx-auto">
      <div
        id="TopMenu"
        class="w-full flex items-center justify-center px-2 h-10 my-2"
      >
        <img src="/threads-logo.png" alt="logo" class="w-[35px]" />
      </div>
    </div>

    <div class="flex w-full max-w-[500px] mx-auto h-[calc(100vh-140px)]">
      <slot />
    </div>

    <div
      id="BottomNav"
      class="fixed z-50 bottom-0 flex w-full h-[70px] border-t border-t-gray-700 bg-black"
    >
      <div
        class="flex w-full max-w-[500px] mx-auto items-center justify-around"
      >
        <UButton
          @click="navigateTo('/')"
          icon="i-heroicons-home"
          variant="link"
        />
        <UButton
          @click="navigateTo('/createPost'), (userStore.isMenuOverlay = true)"
          icon="i-heroicons-pencil-square"
          variant="link"
        />
        <UButton
          @click="navigateTo('/'), (userStore.isLogoutOverlay = true)"
          icon="i-heroicons-arrow-right-start-on-rectangle"
          variant="link"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/stores/users.js";
const userStore = useUserStore();

onMounted(() => {
  console.log(userStore.posts);
});
</script>

<style></style>
