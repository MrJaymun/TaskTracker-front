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
        <button>Доска активных задач</button>
        <button @click="$router.push('/taskList')">Список задач</button>
      </div>

      <div v-if="isEmpty">
        Пока что нет задач
      </div>
      <div class="kanban__main">
        <div class="kanban__slave"
             @drop="onDrop($event, 'Planned')"
             @dragover.prevent
        >
          <p v-if="this.getPlannedTasks.length == 0">Нет запланированных задач</p>
          <KanbanTaskUnit v-for="task in this.getPlannedTasks"
                        :key="task.id"
                        :id="task.id"
                        :name="task.name"
                        :performer="task.performer"
                        :comments-count="task.commentsCount"
                        :status="task.status"
          >

          </KanbanTaskUnit>
        </div>
        <div class="kanban__slave"
             @drop="onDrop($event, 'In progress')"
             @dragover.prevent
        >
          <p v-if="this.getActiveTasks.length == 0">Нет активных задач</p>
          <KanbanTaskUnit v-for="task in this.getActiveTasks"
                          :key="task.id"
                          :id="task.id"
                          :name="task.name"
                          :performer="task.performer"
                          :comments-count="task.commentsCount"
                          :status="task.status"
          >

          </KanbanTaskUnit>
        </div>
        <div class="kanban__slave"
             @drop="onDrop($event, 'Finished')"
             @dragover.prevent
        >
          <p v-if="this.getFinishedTasks.length == 0">Нет выполненных задач</p>
          <KanbanTaskUnit v-for="task in this.getFinishedTasks"
                          :key="task.id"
                          :id="task.id"
                          :name="task.name"
                          :performer="task.performer"
                          :comments-count="task.commentsCount"
                          :status="task.status"
          >

          </KanbanTaskUnit>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import router from "@/router";
import KanbanTaskUnit from "@/components/KanbanTaskUnit";

export default {
  name: "KanbanPage",
  components: {KanbanTaskUnit},
  data(){
    return{
      login: '',
      isEmpty: false
      //Пустые столбцы
    }
  },
  methods:{
    ...mapActions(['getTasks', 'updateTheTaskStatus']),
    ...mapMutations(['addTaskToList', 'clearTaskList']),
    onDrop(e, newStatus) {


      this.updateTheTaskStatus({
        userLogin: localStorage.getItem("login"),
        userPassword: localStorage.getItem("password"),
        projectId: localStorage.getItem("projectId"),
        taskId: e.dataTransfer.getData('taskId'),
        status: newStatus
      }).then(() => {
        this.fillPage()
      }).catch(error =>{
        console.log(error)
      })
    },

    fillPage(){
      this.login=localStorage.getItem("login")

      this.clearTaskList()
      this.getTasks({
        login: localStorage.getItem("login"),
        password: localStorage.getItem("password"),
        id: localStorage.getItem("projectId")
      }).then(response => {

        if(response.status === 200){

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

  },
  computed:{
    ...mapGetters(['getPlannedTasks', 'getActiveTasks', 'getFinishedTasks'])

  },
  mounted() {
    this.fillPage()
  }
}
</script>

<style scoped>

.kanban__main{
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
  .kanban__slave{
    margin-left: 2%;
  }
</style>