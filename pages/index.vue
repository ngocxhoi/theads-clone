<template>
  <MainLayout>
    <div id="IndexPage" class="w-full overflow-auto">
      <div class="mx-auto max-w-[500px] overflow-hidden">
        <div id="Posts" class="px-4 max-w-[600px] mx-auto">
          <!-- <pre class="text-white">{{ user }}</pre> -->
          <div
            v-if="isPosts"
            v-for="(post, index) in posts"
            :id="'post' + index"
          >
            <Post
              :post="post"
              @isDeleted="posts = userStore.getAllPosts()"
              class="mb-4"
            />

            <!-- Overlay loading -->
            <div
              v-if="isLoading"
              class="inset-0 absolute flex flex-col items-center justify-center bg-black bg-opacity-40"
            >
              <div
                class="text-white mx-auto flex flex-col items-center justify-center"
              >
                <div
                  class="h-4 w-4 border-2 border-white border-t-transparent animate-spin"
                ></div>
                <p class="w-full mt-1">Loading...</p>
              </div>
            </div>
          </div>
          <div v-else>
            <ClientOnly>
              <div
                v-if="isLoading"
                class="mt-20 w-full flex items-center justify-center mx-auto"
              >
                <div
                  class="text-white mx-auto flex flex-col items-center justify-center"
                >
                  <div
                    class="h-4 w-4 border-2 border-white border-t-transparent animate-spin"
                  ></div>
                  <p class="w-full mt-1">Loading...</p>
                </div>
              </div>
              <div
                v-if="!isLoading"
                class="mt-20 w-full flex items-center justify-center mx-auto"
              >
                <div
                  class="text-white mx-auto flex flex-col items-center justify-center"
                >
                  <div>
                    <Icon name="😊" size="50" />
                  </div>
                  <p class="w-full mt-1">Make the first post</p>
                </div>
              </div>
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from "~/layouts/MainLayout.vue";

const userStore = useUserStore();
const user = useSupabaseUser();

watchEffect(() => {
  if (!user.value) {
    navigateTo("/auth");
  }
});

let posts = ref([{}]);
let isPosts = ref(false);
let isLoading = ref(false);

onBeforeMount(async () => {
  try {
    isLoading.value = true;
    await userStore.getAllPosts();
    isLoading.value = false;
  } catch (error) {
    console.log(error);
  }
});

onMounted(() => {
  watchEffect(() => {
    posts.value = userStore.posts;
    if (userStore.posts && userStore.posts.length > 0) {
      isPosts.value = true;
    } else {
      isPosts.value = false;
    }
  });
});

watch(
  () => posts.value,
  () => {
    posts.value = userStore.posts;
    if (userStore.posts && userStore.posts.length > 0) {
      isPosts.value = true;
    } else {
      isPosts.value = false;
    }
  },
  { deep: true }
);
</script>

<style scoped>
html,
body {
  scroll-behavior: smooth;
}
/* width */
::-webkit-scrollbar {
  width: 2px;
}

/* Track */
::-webkit-scrollbar-track {
  background: transparent;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: red;
}
</style>
