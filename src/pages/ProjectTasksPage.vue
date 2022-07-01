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
        <button @click="$router.push('/createTask')">Добавить задачу</button>
        <button @click="$router.push('/kanban')">Доска активных задач</button>
        <button>Список задач</button>
      </div>
      <p v-if="!isEmpty" >Введите название задачи</p>
      <input v-if="!isEmpty" v-model="filtered">
      <p v-if="!isEmpty" >Выберите статус</p>
      <select v-if="!isEmpty" v-model="status">
        <option v-for="status in this.statuses" v-bind:value="status.value" v-bind:key="status.value">
          {{status.text}}
        </option>
      </select>

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
      filtered: ''

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