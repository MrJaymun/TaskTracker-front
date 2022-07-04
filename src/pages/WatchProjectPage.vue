<template>
  <div class="body">
    <div class="header" v-show="!showModal">

      <div class="entered">
        <div class="entered__hello">
          <p>Вы вошли как {{this.login}}</p>
          <img src='@/assets/arrowdown.png' alt="Раскрыть список"/>
        </div>


        <div class="entered__buttons">
          <button class="button" style="--clr:#ffff00" @click="$router.push('/')"><span>На главную</span><i></i></button>
          <button class="button" style="--clr:#ffff00" @click="$router.push('/changePassword')"><span>Изменить пароль</span><i></i></button>
          <button class="button" style="--clr:#ffff00" @click="$router.push('/createProject')"><span>Создать проект</span><i></i></button>
          <button class="button" style="--clr:#ffff00" @click="$router.push('/auth')"><span>Выйти</span><i></i></button>
        </div>
      </div>

    </div>


    <div class="info-page">
      <p v-show="!showModal" class="info-page__block-name">Проект</p>
      <p v-show="!showModal">{{this.name}}</p>
      <p v-show="!showModal" class="info-page__block-name">Описание проекта</p>
      <textarea v-show="!showModal" v-model="description" class="textarea" readonly></textarea>
      <p v-show="!showModal">Автор проекта:&nbsp;&nbsp;&nbsp;{{this.author}} </p>
      <p v-show="!showModal" class="info-page__block-name">Участники проекта</p>

      <div v-show="!showModal" v-for="user in this.users" v-bind:key="user">
        {{user}}
      </div>
      <button v-show="!showModal" class="button data-changing-button" style="--clr:#ffff00" @click="joinProject"><span>Стать участником</span><i></i></button>
      <div v-show="showModal">
        <div class="modal-background">

        </div>
        <div class="modal-text-part form-wide-modal">
          <p>{{this.textModal}}</p>
          <button class="button" style="--clr:#00ff00" @click="toProjectMainPage">
            <span>Понятно</span><i></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "WatchProjectPage",
  data(){
    return{
      login: '',
      id: '',
      name: '',
      description: '',
      author: '',
      users: [],
      showModal: false,
      textModal: "",
      isActive: true
    }
  },
  methods:{
    ...mapActions(['watchTheProject', 'joinTheProject']),

    joinProject(){
      this.joinTheProject({
        id: localStorage.getItem("watchId"),
        login: localStorage.getItem("login"),
        password: localStorage.getItem("password")
      }).then(response => {
        console.log(response)
        if(response.status == 201){
          this.showModal = true;
          this.textModal = 'Вы присоединились к проекту!';
        }
      }).catch(error => {
        this.showModal = true;
        this.textModal = error.response.data;
      })
    },
    toProjectMainPage(){
      localStorage.removeItem("projectId")
      localStorage.removeItem("watch  Id")
      localStorage.setItem("projectId", this.id)
      this.$router.push('/ProjectMain')
    }
  },
  mounted() {
      this.login=localStorage.getItem("login")
      this.watchTheProject({
        login: localStorage.getItem("login"),
        password: localStorage.getItem("password"),
        id: localStorage.getItem("watchId"),
      }).then(response =>{
        console.log(response)
        this.id = response.data.value.id,
        this.name = response.data.value.name,
        this.description = response.data.value.description,
        this.author = response.data.value.author,
        this.users = response.data.value.users
      }).catch(error =>{
        console.log(error)
      })
  }
}
</script>

<style scoped>


</style>