<template>
  <div class="body">
    <div v-show="!showModal" class="header">

      <div class="entered">
        <div class="entered__hello">
          <p>Вы вошли как {{this.login}}</p>
          <img src='@/assets/arrowdown.png' alt="Раскрыть список"/>
        </div>


        <div class="entered__buttons">
          <button class="button" style="--clr:#ffff00" @click="$router.push('/')"><span>На главную</span><i></i></button>
          <button class="button" style="--clr:#ffff00" @click="$router.push('/changePassword')"><span>Изменить пароль</span><i></i></button>
          <button class="button" style="--clr:#ffff00"><span>Создать проект</span><i></i></button>
          <button class="button" style="--clr:#ffff00" @click="$router.push('/auth')"><span>Выйти</span><i></i></button>
        </div>
      </div>

    </div>

    <div  class="page-form-wide">
      <form v-show="!showModal" @submit.prevent="addProject">

        <div class="form-wide-element">
          <p>Введите название проекта   <input v-model="name" minlength="3" maxlength="30"></p>
        </div>

        <div class="form-wide-text-area">
          <p>Введите описание проекта   </p>
          <textarea  v-model="desc" minlength="5" maxlength="1000"></textarea>
        </div>

        <div class="form-wide-checkbox checkbox">
          <p> Это личный проект </p>
          <input  type="checkbox" v-model="isPersonal">
        </div>

        <div>
          <button class="button" style="--clr:#ffff00" type="submit"><span>Создать проект</span><i></i></button>
        </div>
      </form>

      <div v-show="showModal">
        <div class="modal-background">

        </div>
        <div class="modal-text-part form-wide-modal">
          <p>{{this.textModal}}</p>
          <button class="button" style="--clr:#00ff00"  @click="closeModal()">
            <span>Понятно</span><i></i>
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
      if(this.name.trim() !== ''){
        if(this.desc.trim() !== ''){
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
        }
        else{
          this.showModal = true;
          this.textModal = 'Введите описание проекта';
        }

      }
      else{
        this.showModal = true;
        this.textModal = 'Введите название проекта';
      }


    },
    closeModal(){
      if(this.textModal === 'Проект успешно создан'){
        router.push("/projectMain")
      }
      this.showModal = false;

    }
  },
  mounted() {
    this.login=localStorage.getItem("login")
  }
}
</script>

<style scoped>

</style>