<template>
  <div class="z-50 bottom-0 h-full w-full">
    <div class="py-2 w-full">
      <div class="flex items-center justify-between">
        <div class="flex items-center text-white">
          <img
            :src="post?.image"
            alt=""
            class="rounded-full h-[35px] w-[35px]"
          />
          <div class="ml-2 font-semibold text-[18px]">{{ post?.name }}</div>
        </div>

        <div
          v-if="
            user &&
            user.identities &&
            user.identities[0].user_id == post?.userId
          "
          class="relative"
        >
          <UPopover
            @click="deletePost(post.id, post.picture)"
            :popper="{ placement: 'bottom-end', offsetDistance: 0 }"
            :ui="{ background: 'bg-black' }"
          >
            <UButton
              icon="i-heroicons-ellipsis-horizontal"
              variant="link"
              :disabled="isDeleting"
            />
            <template #panel>
              <div>
                <UButton
                  size="xs"
                  variant="link"
                  color="red"
                  label="Delete"
                  trailing-icon="i-heroicons-trash"
                />
              </div>
            </template>
          </UPopover>
        </div>
      </div>

      <div class="relative flex items-center w-full">
        <div class="w-[42px] mx-auto">
          <div
            class="absolute ml-4 mt-1 top-0 w-[1px] bg-gray-700 h-full"
          ></div>
        </div>

        <div class="bg-black rounded-lg w-[calc(100%-50px)] text-sm font-light">
          <div class="py-2 text-gray-300">{{ post?.text }}</div>
          <img
            v-if="post && post.picture"
            class="mx-auto w-full mt-2 pr-2 rounded"
            :src="runtimeConfig.public.bucketUrl + post.picture"
            alt=""
          />

          <div class="mt-2 w-full ml-2 flex items-center">
            <UTooltip
              :ui="{
                background: 'bg-black',
                color: 'text-white',
                transition: {
                  enterActiveClass:
                    'transition ease-out duration-200 delay-[2s]',
                },
              }"
              text="Like"
            >
              <UButton
                @click="likeFunc()"
                :icon="
                  hasLikedComputed
                    ? 'i-heroicons-heart-solid'
                    : 'i-heroicons-heart'
                "
                variant="link"
                color="red"
                class="gap-1 z-10"
              />
            </UTooltip>
            <UTooltip
              :ui="{
                background: 'bg-black',
                color: 'text-white',
                transition: {
                  enterActiveClass:
                    'transition ease-out duration-200 delay-[2s]',
                },
              }"
              text="Comments"
            >
              <UButton
                :icon="'i-heroicons-chat-bubble-oval-left'"
                variant="link"
                color="red"
                class="gap-1"
              />
            </UTooltip>
            <UTooltip
              :ui="{
                background: 'bg-black',
                color: 'text-white',
                transition: {
                  enterActiveClass:
                    'transition ease-out duration-200 delay-[2s]',
                },
              }"
              text="Report"
            >
              <UButton
                :icon="'i-heroicons-arrow-path-rounded-square'"
                variant="link"
                color="red"
                class="gap-1"
              />
            </UTooltip>
            <UTooltip
              :ui="{
                background: 'bg-black',
                color: 'text-white',
                transition: {
                  enterActiveClass:
                    'transition ease-out duration-200 delay-[2s]',
                },
              }"
              text="Share"
            >
              <UButton
                :icon="'i-heroicons-paper-airplane'"
                variant="link"
                color="red"
                class="gap-1"
              />
            </UTooltip>
          </div>

          <div class="flex items-center absolute -bottom-8 ml-2">
            <div class="relative text-sm text-gray-500 mr-4">
              <div><span class="mr-1">10</span>replies</div>
            </div>
            <div class="relative text-sm text-gray-500">
              <div class="flex items-center">
                <span v-if="isLike" class="mr-1">
                  <div
                    class="h-2 w-2 rounded-full border border-white border-t-transparent animate-spin"
                  ></div>
                </span>
                <span v-else class="mr-1">{{ post.likes.length }}</span
                >likes
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="relative inline-block text-gray-500 pt-1 pb-1.5">
      <div class="flex items-center">
        <div class="flex items-center flex-wrap text-white gap-1 w-[42px]">
          <UAvatarGroup :max="1" size="2xs">
            <UAvatar
              src="https://avatars.githubusercontent.com/u/739984?v=4"
              alt="benjamincanac"
            />
            <UAvatar
              src="https://avatars.githubusercontent.com/u/904724?v=4"
              alt="Atinux"
            />
            <UAvatar
              src="https://avatars.githubusercontent.com/u/904724?v=4"
              alt="Atinux"
            />
          </UAvatarGroup>
        </div>
      </div>
    </div>
  </div>

  <!-- Overlay loading -->
  <div
    v-if="isDeleting"
    class="inset-0 absolute flex flex-col items-center justify-center bg-black bg-opacity-40"
  >
    <div class="text-white mx-auto flex flex-col items-center justify-center">
      <div
        class="h-4 w-4 border-2 border-white border-t-transparent animate-spin"
      ></div>
      <p class="w-full mt-1">Loading...</p>
    </div>
  </div>
</template>

<script setup>
const userStore = useUserStore();

const client = useSupabaseClient();
const user = useSupabaseUser();

let isLike = ref(false);
let isDeleting = ref(false);

let runtimeConfig = useRuntimeConfig();

const props = defineProps({
  post: Object,
});

const emit = defineEmits(["isDeleted"]);

const hasLikedComputed = computed(() => {
  if (!user.value) return;
  let res = false;

  props.post.likes.forEach((like) => {
    if (
      like.userId == user.value.identities[0].user_id &&
      like.postId == props.post.id
    ) {
      res = true;
    } else res = false;
  });
  return res;
});

const deletePost = async (id, picture) => {
  let res = confirm("Are u want to delete this post?");
  if (!res) return;
  try {
    isDeleting.value = true;

    const { data, error } = await client.storage
      .from("thread-clone-file")
      .remove([picture]);

    await useFetch(`/api/delete-post/${id}`, {
      method: "delete",
    });

    emit("isDeleted", true);

    isDeleting.value = false;
  } catch (error) {
    console.log(error);
    isDeleting.value = false;
  }
};

const likePost = async (id) => {
  isLike.value = true;
  try {
    await useFetch("/api/like", {
      method: "post",
      body: {
        userId: user.value.identities[0].user_id,
        postId: id,
      },
    });
    await userStore.getAllPosts();
    isLike.value = false;
  } catch (error) {
    console.log(error);
    isLike.value = false;
  }
};

const unLikePost = async (id) => {
  isLike.value = true;
  try {
    await useFetch(`/api/unlike-post/${id}`, {
      method: "delete",
    });
    await userStore.getAllPosts();
    isLike.value = false;
  } catch (error) {
    console.log(error);
    isLike.value = false;
  }
};

const likeFunc = () => {
  let likePostObj = null;

  if (props.post.likes.length < 1) {
    likePost(props.post.id);
    return null;
  } else {
    props.post.likes.forEach((like) => {
      if (
        like.userId == user.value.identities[0].user_id &&
        like.postId == props.post.id
      ) {
        likePostObj = like;
      }
    });
  }

  if (likePostObj) {
    unLikePost(likePostObj.id);
    return null;
  }
  likePost(props.post.id);
};
</script>

<style></style>
