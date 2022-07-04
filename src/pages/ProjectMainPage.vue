<template>
  <div class="body">
    <div v-show="!showModal" class="header">

      <div class="entered" @mouseover="hideNav = true" @mouseleave="hideNav = false">
        <div class="entered__hello">
          <p>Вы вошли как {{this.login}}</p>
          <img src='@/assets/arrowdown.png' alt="Раскрыть список"/>
        </div>


        <div class="entered__buttons">

          <button  class="button" style="--clr:#ffff00" @click="$router.push('/')"> <span>На главную</span><i></i></button>
          <button class="button" style="--clr:#ffff00" @click="$router.push('/changePassword')"><span>Изменить пароль</span><i></i></button>
          <button class="button" style="--clr:#ffff00" @click="$router.push('/createProject')"><span>Создать проект</span><i></i></button>
          <button class="button" style="--clr:#ffff00" @click="$router.push('/auth')"><span>Выйти</span><i></i></button>
        </div>
      </div>

    </div>


    <div>

      <div v-show="!showModal" class="project-header">

        <div class="project-nav" v-if="!hideNav">
          <button data-text="Главная страница">Главная страница</button>
          <button data-text="Добавить задачу" @click="$router.push('/createTask')">Добавить задачу</button>
          <button data-text="Доска активных задач" @click="$router.push('/kanban')">Доска активных задач</button>
          <button data-text="Список задач" @click="$router.push('/taskList')">Список задач</button>
        </div>

        <div class="project-nav  balancer" v-if="hideNav">
        </div>
      </div>

      <div class="info-page">

        <p v-show="!showModal" class="info-page__block-name">Проект</p>
        <input v-show="!showModal" v-model="name" :readonly=noChanging class="name" minlength="3" maxlength="50">


        <p v-show="!showModal" class="info-page__block-name">Описание проекта</p>
        <textarea v-show="!showModal" v-model="description" class="textarea" :readonly=noChanging minlength="5" maxlength="500"></textarea>

        <div v-show="!showModal" class="data-changing">
            <button class="button data-changing-button" style="--clr:#ffff00" v-if="isCreator && noChanging" @click="beginChanging"><span>Изменить</span><i></i></button>
            <div class="buttons-decision" v-if="isCreator && !noChanging">
                  <button class="button decision-button" style="--clr:#ffff00"  @click="stopChanging"><span>Отменить изменения</span><i></i></button>
                  <button class="button decision-button" style="--clr:#ffff00"  @click="changeData"><span>Сохранить изменения</span><i></i></button>
            </div>

            <button class="button data-changing-button" data-changing-button style="--clr:#ffff00"  v-if="isCreator && noDeleting" @click="beginDeleting"><span>Удалить</span><i></i></button>

            <div class="buttons-decision" v-if="isCreator && !noDeleting">
                <button class="button decision-button" style="--clr:#ffff00"  @click="stopDeleting"><span>Отменить удаление</span><i></i></button>
                <button class="button decision-button" style="--clr:#ff0000"  @click="deletePr"><span>Подтвердить удаление</span><i></i></button>
            </div>
        </div>

      <div v-show="showModal">
        <div class="modal-background">

        </div>
        <div  class="modal-text-part form-wide-modal">
          <p>{{this.textModal}}</p>
          <button class="button" style="--clr:#00ff00" @click="endDeleting">
            <span>Понятно</span ><i></i>
          </button>
        </div>
      </div>
        <p v-show="!showModal">Активных задач:&nbsp;&nbsp;&nbsp;  {{this.activeTasks}}</p>
        <p v-show="!showModal">Всего задач:&nbsp;&nbsp;&nbsp;{{this.allTasks}} </p>
        <p v-show="!showModal">Автор проекта:&nbsp;&nbsp;&nbsp;{{this.author}} </p>
        <p v-show="!showModal" class="info-page__block-name">Участники проекта</p>
        <div v-show="!showModal" v-for="user in this.users" v-bind:key="user">
          {{user}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>


import {mapActions} from "vuex";
import router from "@/router";

export default {
  name: "ProjectMainPage",
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
      noChanging: true,
      allTasks: 0,
      activeTasks: 0,
      isCreator: false,
      noDeleting: true,
      hideNav: false
    }
  },
  methods:{



    ...mapActions(['goToProject', 'changeTheProject', 'deleteProject']),
    beginChanging(){
     this.noChanging = false
    },
    stopChanging(){
      this.noChanging = true
    },
    beginDeleting(){
      this.noDeleting = false
    },
    stopDeleting(){
      this.noDeleting = true
    },
    deletePr(){
      this.deleteProject({
        id: localStorage.getItem("projectId"),
        login: localStorage.getItem("login"),
        password: localStorage.getItem("password")
      }).then(response => {
        if(response.status === 201){
          this.showModal = true;
          this.textModal = "Проект успешно удален"
        }
      }).catch(() =>{
          this.closeModal()
      })

    },
    endDeleting(){

      this.$router.push('/')
      localStorage.removeItem("projectId")
    },

    closeModal(){
      this.showModal = false;
    },
    changeData(){
      this.noChanging = true
      this.changeTheProject({
        id: localStorage.getItem("projectId"),
        login: localStorage.getItem("login"),
        password: localStorage.getItem("password"),
        newName: this.name,
        newDesc: this.description
      }).then(response=>{
        console.log(response)
      }).catch(error => {
        console.log(error)
      })
    }

  },
  mounted() {
    this.login=localStorage.getItem("login")

    this.goToProject({
      login: localStorage.getItem("login"),
      password: localStorage.getItem("password"),
      id: localStorage.getItem("projectId"),
    }).then(response =>{
      this.id = response.data.value.id,
      this.name = response.data.value.name,
      this.description = response.data.value.description,
      this.author = response.data.value.author,
      this.users = response.data.value.users
      this.allTasks = response.data.value.allTasks
      this.activeTasks = response.data.value.activeTasks

      if(this.author === localStorage.getItem("login")){
              this.isCreator = true;
      }
    }).catch(() =>{
      router.push("/");
    })



  }
}
</script>

<style scoped>

</style>