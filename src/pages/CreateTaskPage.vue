<template>
  <div class="body">
    <div class="header" v-show="!showModal">

      <div class="entered" @mouseover="hideNav = true" @mouseleave="hideNav = false" >
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


    <div>

      <div class="project-header">

        <div class="project-nav" v-if="!hideNav" v-show="!showModal">
          <button data-text="Главная страница" @click="$router.push('/projectMain')">Главная страница</button>
          <button data-text="Добавить задачу">Добавить задачу</button>
          <button data-text="Доска активных задач" @click="$router.push('/kanban')">Доска активных задач</button>
          <button data-text="Список задач" @click="$router.push('/taskList')">Список задач</button>
        </div>

        <div class="project-nav  balancer" v-if="hideNav">
        </div>
      </div>

      <div >
        <div class="page-form-wide" v-show="!showModal">
          <form @submit.prevent="addTask">
            <div class="form-wide-element">
              <p>Введите название задачи  <input v-model="name"  minlength="3" maxlength="50"></p>

            </div>

            <div class="form-wide-text-area">
              <p>Введите описание задачи</p>
              <textarea  v-model="desc" minlength="5" maxlength="500"></textarea>
            </div>


            <div class="form-wide-select">
              <p>
                Исполнитель
              </p>
              <select v-model="chosen">
                <option v-for="user in this.users" v-bind:value="user.value" v-bind:key="user.value">
                  {{user.text}}
                </option>
                </select>
            </div>
            <button class="button" style="--clr:#ffff00" type="submit"><span>Создать задачу</span><i></i></button>
       </form>

        </div>

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
  </div>
</template>

<script>
import {mapActions} from "vuex";
import router from "@/router";

export default {
  name: "CreateTaskPage",
  data() {
    return {
      login: '',
      id: '',
      users: [],
      showModal: false,
      textModal: '',
      name: '',
      desc: '',
      chosen: '',
      hideNav: false
    }
  },
  methods: {
    ...mapActions(['goToProject', 'createTask']),
    closeModal(){
      if(this.textModal === 'Задача успешно создана'){
        this.$router.push('/Task')
      }
      this.showModal = false;
    },
    addTask(){
      if(this.name.trim().length >= 3 && this.desc.trim().length >= 5 && this.chosen !== ''){
       this.createTask({
         userLogin:  localStorage.getItem("login"),
         userPassword:  localStorage.getItem("password"),
         performerLogin: this.chosen,
         name: this.name,
         description: this.desc,
         project: localStorage.getItem("projectId")
       }).then(response => {
         if(response.status === 201){
           this.showModal = true;
           this.textModal = 'Задача успешно создана';
           localStorage.setItem("taskId", response.data.value)
         }
       }).catch(error => {
         this.showModal = true;
         this.textModal = error.response.data;
       })

      }
      else{

        if(this.name.trim() == ''){

          this.showModal = true;
          this.textModal = 'Введите название задачи';
        }
        else{
          if(this.chosen === ''){
            this.showModal = true;
            this.textModal = 'Выберите исполнителя';
          }
          else{
            this.showModal = true;
            this.textModal = 'Введите описание задачи';
          }
        }
      }

    }
  },
  mounted() {
    this.login = localStorage.getItem("login")

    this.goToProject({
      login: localStorage.getItem("login"),
      password: localStorage.getItem("password"),
      id: localStorage.getItem("projectId"),
    }).then(response => {
      this.id = response.data.value.id

          response.data.value.users.forEach((value) => {
              this.users.push({
                text: value, value: value
              })
          })
    }).catch(() => {
      router.push("/");
    })

  }
}
</script>

<style scoped>

</style>