<template>
  <router-view/>
</template>

<script>
import {mapMutations} from "vuex";

export default {
  name: "App",
  mounted() {
    const login = localStorage.getItem("login")
    const password = localStorage.getItem("password")
    if(!login || !password){
      return
    }
    this.addInfoAboutUser({login, password})
  },
  methods:{
    ...mapMutations(['addInfoAboutUser']),
  }
}
</script>

