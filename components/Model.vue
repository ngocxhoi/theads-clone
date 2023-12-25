<template>
  <div
    class="fixed grid place-items-center h-screen w-full z-50 bottom-0 bg-black bg-opacity-50 backdrop-blur-md"
  >
    <div
      class="bg-black w-full max-w-[300px] rounded-lg text-white border border-gray-600 p-2"
    >
      <UButton
        variant="link"
        color="red"
        label="Close Model"
        icon="i-heroicons-x-mark"
        @click="userStore.isLogoutOverlay = false"
        class="rounded-full"
      />
      <div class="border-b border-b-gray-700 my-1"></div>
      <UButton
        variant="link"
        color="red"
        label="Log Out"
        icon="i-heroicons-arrow-right-start-on-rectangle"
        @click="logout()"
        class="rounded-full"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore();
const client = useSupabaseClient();

const logout = () => {
  client.auth.signOut();
  userStore.isLogoutOverlay = false;
  return navigateTo("/");
};
</script>

<style></style>
