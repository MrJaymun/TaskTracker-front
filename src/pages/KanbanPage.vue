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
          <button data-text="Главная страница"  @click="$router.push('/projectMain')">Главная страница </button>
          <button data-text="Добавить задачу" @click="$router.push('/createTask')">Добавить задачу</button>
          <button data-text="Доска активных задач">Доска активных задач</button>
          <button data-text="Список задач" @click="$router.push('/taskList')">Список задач</button>
        </div>

        <div class="project-nav  balancer" v-if="hideNav">
        </div>
      </div>

      <div v-if="isEmpty">
        <p class="list__name">Пока нет задач</p>
      </div>
      <div class="kanban__main" v-if="!isEmpty">
        <div class="kanban__slave"
             @drop="onDrop($event, 'Planned')"
             @dragover.prevent
        >
          <p v-if="this.getPlannedTasks.length == 0">Нет запланированных задач</p>
          <p class="list__name" v-if="this.getPlannedTasks.length != 0">Запланированные задачи</p>
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
          <p class="list__name" v-if="this.getActiveTasks.length != 0">Активные задачи</p>
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
          <p class="list__name" v-if="this.getFinishedTasks.length != 0">Выполненные задачи</p>
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
      isEmpty: false,
      hideNav: false
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


</style>