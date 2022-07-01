<template>
  <div>
    <div>
      <p>Вы вошли как {{this.login}}</p>
      <button @click="$router.push('/')">На главную</button>
      <button @click="$router.push('/changePassword')">Изменить пароль</button>
      <button @click="$router.push('/createProject')">Создать проект</button>
      <button @click="$router.push('/auth')">Выйти</button>
    </div>

    <div>
      <p>{{this.name}}</p>
      <p>Описание проекта:</p>
      <textarea v-model="description" class="textarea" readonly></textarea>
      <p>Автор проекта:</p>
      <p>{{this.author}}</p>
      <p>Участники проекта:</p>

      <div v-for="user in this.users" v-bind:key="user">
        {{user}}
      </div>
      <button @click="joinProject">Стать участником</button>
      <div v-show="showModal">
        <div class="auth__modal-background">

        </div>
        <div  class="auth__modal-text-part">
          <p>{{this.textModal}}</p>
          <button class="auth__form-button" @click="toProjectMainPage">
            ПОНЯТНО
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
.textarea{
  width: 80%;
  resize: none;
  height: 200px;
}

</style>