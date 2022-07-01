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

      <div>
        <button>Главная страница</button>
        <button @click="$router.push('/createTask')">Добавить задачу</button>
        <button @click="$router.push('/kanban')">Доска активных задач</button>
        <button @click="$router.push('/taskList')">Список задач</button>
      </div>

      <input v-model="name" :readonly=noChanging class="name">
      <p>Описание проекта:</p>
      <textarea v-model="description" class="textarea" :readonly=noChanging></textarea>
      <br>
      <button v-if="isCreator && noChanging" @click="beginChanging">Изменить</button>
      <button v-if="isCreator && !noChanging" @click="stopChanging">Отменить</button>
      <button v-if="isCreator && !noChanging" @click="changeData">Сохранить</button>
      <br>
      <button v-if="isCreator && noDeleting" @click="beginDeleting">Удалить</button>
      <button v-if="isCreator && !noDeleting" @click="stopDeleting">Отменить удаление</button>
      <button v-if="isCreator && !noDeleting " @click="deletePr">Подтвердить удаление</button>

      <div v-show="showModal">
        <div class="auth__modal-background">

        </div>
        <div  class="auth__modal-text-part">
          <p>{{this.textModal}}</p>
          <button class="auth__form-button" @click="endDeleting">
            ПОНЯТНО
          </button>
        </div>
      </div>

      <p>Активных задач:</p>
      <p>{{this.activeTasks}}</p>

      <p>Всего задач:</p>
      <p>{{this.allTasks}}</p>

      <p>Автор проекта:</p>
      <p>{{this.author}}</p>

      <p>Участники проекта:</p>

      <div v-for="user in this.users" v-bind:key="user">
        {{user}}
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
      noDeleting: true
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
.textarea{
  width: 80%;
  resize: none;
  height: 200px;
}

.name{
  width: 30%;
}
</style>