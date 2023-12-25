<template>
  <div
    id="CreatePost"
    class="fixed z-50 bottom-0 h-full w-full overflow-hidden"
  >
    <div class="bg-black h-full w-full text-white overflow-auto">
      <div
        class="flex items-center justify-start py-4 max-w-[500px] mx-auto border-b border-b-gray-700"
      >
        <UButton
          variant="link"
          color="red"
          icon="i-heroicons-x-mark"
          @click="
            navigateTo('/');
            userStore.isMenuOverlay = false;
            clearData();
          "
          class="rounded-full px-2"
        />
        <div class="text-[16px] font-semibold">New Thread</div>
      </div>

      <div
        id="Post"
        class="z-40 bottom-0 max-h-[100vh-200px] w-full px-3 max-w-[500px] mx-auto"
      >
        <div class="py-2 w-full">
          <div class="flex flex-col items-start">
            <div v-if="user" class="flex items-center text-white">
              <img
                :src="user.identities[0].identity_data.avatar_url"
                alt=""
                class="rounded-full h-[35px] w-[35px]"
              />
              <h1 class="ml-2 font-semibold text-[18px]">{{ user.identities[0].identity_data.user_name }}</h1>
            </div>

            <div class="relative flex items-center w-full">
              <div class="w-[42px] mx-auto">
                <div
                  class="absolute ml-4 mt-1 top-0 w-[1px] bg-gray-700 h-full"
                ></div>
              </div>
              <div
                class="bg-black rounded-lg w-[calc(100%-50px)] text-white font-light"
              >
                <!-- Text -->
                <div class="pt-2 text-gray-300 bg-black w-full">
                  <UTextarea
                    autoresize
                    placeholder="Start your thread ..."
                    :padded="false"
                    variant="none"
                    v-model="text"
                  />
                </div>
                <!-- Image -->
                <div class="w-full">
                  <div class="flex flex-col gap-2 py-1">
                    <div v-if="fileDisplay" class="relative">
                      <UButton
                        icon="i-heroicons-x-mark"
                        color="red"
                        variant="link"
                        @click="
                          onUndoFile(),
                            toast.add({
                              title: 'Undo remove image file ?',
                              actions,
                            })
                        "
                        class="absolute right-0 top-2 rounded-full bg-gray-400 hover:bg-gray-700 transition-colors"
                      />
                      <img
                        :src="fileDisplay"
                        alt=""
                        class="mx-auto w-full mt-2 mr-2 rounded-lg"
                      />
                    </div>
                    <label for="fileInput" class="mt-4 cursor-pointer">
                      <UIcon
                        name="i-heroicons-paper-clip"
                        class="scale-150 translate-x-1"
                      />
                      <input
                        ref="file"
                        type="file"
                        id="fileInput"
                        @input="onChange"
                        hidden
                        accept=".jpg,.jpeg,.png"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        v-if="text"
        :disabled="isLoading"
        class="fixed bottom-0 font-bold text-lg w-full bg-black inline-block float-right p-4 border-t border-t-gray-700"
        :class="isLoading?'text-gray-600': 'text-blue-600'"
        >
        <p v-if="!isLoading" @click="createPost()">Post</p>
        <p v-else class="flex items-center gap-2 justify-center">
          <div class="animate-spin h-4 w-4 rounded-full border-2 border-white border-t-transparent"></div>
          Please wait...
        </p>
      </button>
    </div>
  </div>
</template>

<script setup>
import { v4 as uuid4 } from 'uuid';
const userStore = useUserStore();

const toast = useToast();

const client = useSupabaseClient();
const user = useSupabaseUser();

let text = ref(null);
let isLoading = ref(false);

let file = ref(null);
let cloneFileDisplay = ref(null);
let fileDisplay = ref(null);
let fileData = ref(null);

const clearData = () => {
  text.value = null;
  file.value = null;
  cloneFileDisplay.value = null;
  fileDisplay.value = null;
  fileData.value = null;
};

const onChange = () => {
  fileDisplay.value = URL.createObjectURL(file.value.files[0]);
  fileData.value = file.value.files[0];
};

const onUndoFile = () => {
  cloneFileDisplay.value = fileDisplay.value;
  fileDisplay.value = null;
};

const actions = ref([
  {
    label: "Undo",
    click: () => (fileDisplay.value = cloneFileDisplay.value),
  },
]);

const createPost = async () => {
  let dataOut = null;
  let errorOut = null
  
  isLoading.value = true

  if(fileData.value) {
    const {data, error} = await client
      .storage.from('thread-clone-file')
      .upload(`image/${uuid4()}.jpg`, fileData.value) 

    dataOut = data
    errorOut = error
  }

  if(errorOut) {
    console.log(errorOut);
    return errorOut
  }

  let pic = ''
  if(dataOut) pic = dataOut.path? dataOut.path: '';

  try {
    await useFetch('/api/post', {
      method: 'post',
      body: {
        userId: user.value.identities[0].user_id,
        name: user.value.identities[0].identity_data.user_name,
        image: user.value.identities[0].identity_data.avatar_url,
        text: text.value,
        picture: pic
      }
    })

    await userStore.getAllPosts()
    userStore.isMenuOverlay = false,
    clearData();
    isLoading.value = false
    navigateTo('/')
  } catch (error) {
    console.log(error);
    isLoading.value = false
  }
};
</script>

<style></style>
