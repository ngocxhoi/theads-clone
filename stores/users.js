// stores/counter.js
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    posts: [],
    isMenuOverlay: false,
    isLogoutOverlay: false,
  }),
  actions: {
    async getAllPosts() {
      let res = await useFetch("/api/posts", {
        method: "get",
      });
      this.posts = res.data;
      return res.data;
    },
  },
});
