<template>
  <div id="AuthPage" class="w-full h-screen pt-32">
    <div class="w-full">
      <div class="w-full flex items-center justify-center gap-2.5 p-2">
        <img src="/threads-logo.png" alt="" class="w-[35px]" />
        <span class="font-bold text-2xl text-white">Threads</span>
      </div>
      <div class="max-w-[350px] mx-auto px-2 text-white">
        <h2 class="text-center mb-6 mt-4">Login / Register</h2>
        <button
          @click="login('github')"
          class="flex items-center justify-center gap-3 p-1.5 w-full border rounded-full text-lg font-semibold mb-3"
        >
          <div class="flex items-center gap-2 justify-center">
            <img
              src="/github-logo.png"
              alt=""
              class="w-full max-w-[30px] rounded-full"
            />
            <span>Github</span>
          </div>
        </button>

        <button
          @click="navigateTo('/login')"
          class="flex items-center justify-center gap-3 p-1.5 w-full border rounded-full text-lg font-semibold mb-3"
        >
          <div class="flex items-center gap-2 justify-center">
            <img
              src="/email_color.png"
              alt=""
              class="w-full max-w-[30px] rounded-full"
            />
            <span>Email</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const client = useSupabaseClient();
const user = useSupabaseUser();

watchEffect(() => {
  if (user.value) {
    return navigateTo("/");
  }
});

const login = async (prov) => {
  const { data, error } = await client.auth.signInWithOAuth({
    provider: prov,
    redirectTo: window.location.origin,
  });
  if (error) console.log(error);
};
</script>

<style></style>
