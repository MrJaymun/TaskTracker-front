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

<style>
@import url(http://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900italic,900);

@import './assets/button.css';
@import './assets/header.css';
@import './assets/onlyform-pages.css';
@import './assets/list.css';
@import './assets/checkbox.css';
@import './assets/project-navigation.css';
@import './assets/info-pages.css';
@import './assets/kanban.css';
@import './assets/form.css';
@import './assets/modal.css';
@import './assets/input-textarea-select.css';
@import './assets/body.css';

</style>

