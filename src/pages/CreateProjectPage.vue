<template>
  <div>
    <div>
      <p>Вы вошли как {{this.login}}</p>
      <button @click="$router.push('/')">На главную</button>
      <button @click="$router.push('/changePassword')">Изменить пароль</button>
      <button>Создать проект</button>
      <button @click="$router.push('/auth')">Выйти</button>
    </div>
    <div>
      <form @submit.prevent="addProject">
        <p>Введите название проекта</p>
        <input v-model="name" minlength="3" maxlength="30">
        <p>Введите описание проекта</p>
        <textarea  v-model="desc" minlength="5" maxlength="1000"></textarea>
        <p> Это личный проект <input type="checkbox" v-model="isPersonal"></p>

        <button type="submit">Создать проект</button>
      </form>

      <div v-show="showModal">
        <div class="auth__modal-background">

        </div>
        <div  >
          <p>{{this.textModal}}</p>
          <button @click="closeModal">
            ПОНЯТНО
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";
import router from "@/router";

export default {

  name: "CreateProjectPage",
  data(){
    return{
      login: '',
      name: '',
      desc: '',
      isPersonal: false,
      showModal: false,
      textModal: ""
    }
  },

  methods:{
    ...mapActions(['createProject']),

   addProject(){
      this.createProject({
        userLogin: localStorage.getItem("login"),
        userPassword: localStorage.getItem("password"),
        name: this.name,
        description: this.desc,
        isPersonal: this.isPersonal
      }).then(response => {
        if(response.status === 201){
          localStorage.setItem("projectId", response.data.value)
          this.showModal = true;
          this.textModal = 'Проект успешно создан';
        }
      }).catch(error => {
        this.showModal = true;
        this.textModal = error.response.data;
      })
    },
    closeModal(){

      this.showModal = false;
      router.push("/projectMain")
    }
  },
  mounted() {
    this.login=localStorage.getItem("login")
  }
}
</script>

<style scoped>

</style>