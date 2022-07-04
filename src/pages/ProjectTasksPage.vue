<template>
  <div class="body">
    <div class="header">

      <div class="entered" @mouseover="hideNav = true" @mouseleave="hideNav = false">
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

        <div class="project-nav" v-if="!hideNav">
          <button data-text="Главная страница" @click="$router.push('/projectMain')">Главная страница</button>
          <button data-text="Добавить задачу" @click="$router.push('/createTask')">Добавить задачу</button>
          <button data-text="Доска активных задач" @click="$router.push('/kanban')">Доска активных задач</button>
          <button data-text="Список задач">Список задач</button>
        </div>

        <div class="project-nav  balancer" v-if="hideNav">
        </div>
      </div>
      <div class="list">

        <div class="list__filter-task">
      <p v-if="!isEmpty" >Введите название задачи</p>
      <input v-if="!isEmpty" v-model="filtered">

      <p v-if="!isEmpty" >Выберите статус</p>
      <select v-if="!isEmpty" v-model="status">


        <option v-for="status in this.statuses" v-bind:value="status.value" v-bind:key="status.value">
          {{status.text}}
        </option>
      </select>
        </div>

      <TaskListUnit v-for="task in this.filteredList"
                    :key="task.id"
                    :id="task.id"
                    :name="task.name"
                    :performer="task.performer"
                    :begin-date="task.beginDate"
                    :end-date="task.endDate"
                    :comments-count="task.commentsCount"
                    :status="task.status"
      >

      </TaskListUnit>

      <div v-if="isEmpty">
        Пока что нет задач
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import router from "@/router";

import TaskListUnit from "@/components/TaskListUnit";


export default {
  components: {TaskListUnit},
  name: "ProjectTasksPage",
  data(){
    return{
      login: '',
      isEmpty: false,
      statuses: [
        { text: '', value: ''},
        { text: 'Planned', value: 'Planned'},
        { text: 'In progress', value: 'In progress'},
        { text: 'Finished', value: 'Finished'},
        { text: 'Done', value: 'Done'}
      ],
      status: '',
      filtered: '',
      hideNav: false

    }
  },
  methods:{
    ...mapActions(['getTasks']),
    ...mapMutations(['addTaskToList', 'clearTaskList']),

  },
  computed:{
    ...mapGetters(['getTaskList']),

    filteredList(){
      return this.getTaskList.filter(filter => {
        if (this.filtered === '' && (this.status === '')) {
          return filter;
        }
        else if (this.filtered === '') {
          return filter.status.toString() === this.status;
        }
        else if (this.status === '') {
          return filter.name.toLowerCase().indexOf(this.filtered.toLowerCase()) !== -1;
        }
        else
        {
          return  (filter.name.toLowerCase().indexOf(this.filtered.toLowerCase()) !== -1 && filter.status === this.status);
        }
      })
    },

  },
  mounted() {
    this.login=localStorage.getItem("login")

    this.clearTaskList()

    this.getTasks({
      login: localStorage.getItem("login"),
      password: localStorage.getItem("password"),
      id: localStorage.getItem("projectId")
    }).then(response => {
      if(response.status === 200){
        console.log(response)
        response.data.value.forEach(task =>{

            this.addTaskToList({
              id: task.id,
              name: task.name,
              performer: task.performer,
              beginDate: task.beginDate,
              endDate: task.endDate,
              commentsCount: task.commentsCount,
              status: task.status
            })
        })
      }
    }).catch(error =>{
      if(error.response.data === 'Project not found or there is no tasks'){
        this.isEmpty = true;
      }
      else{
        router.push("/");
      }
    })


  }
}
</script>

<style scoped>

</style>