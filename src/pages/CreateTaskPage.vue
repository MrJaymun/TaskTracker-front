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
        <button @click="$router.push('/projectMain')">Главная страница</button>
        <button>Добавить задачу</button>
        <button @click="$router.push('/kanban')">Доска активных задач</button>
        <button @click="$router.push('/taskList')">Список задач</button>
      </div>

     <div>
       <form @submit.prevent="addTask">
         <p>Введите название задачи</p>
         <input v-model="name"  minlength="3" maxlength="50">
         <p>Введите описание задачи</p>
         <textarea  v-model="desc" minlength="5" maxlength="500"></textarea>

         <p>Исполнитель</p>
         <select v-model="chosen">
           <option v-for="user in this.users" v-bind:value="user.value" v-bind:key="user.value">
             {{user.text}}
           </option>
         </select>


         <button type="submit">Создать задачу</button>
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
      chosen: ''
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