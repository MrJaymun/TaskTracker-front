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
        <button @click="$router.push('/taskList')">Список задач</button>
      </div>


      <p>Статус:</p>
      <select v-model="status">
        <option v-for="status in this.statuses" v-bind:value="status.value" v-bind:key="status.value">
          {{status.text}}
        </option>
      </select>

      <button @click="changeStatus">Подтвердить новый статус</button>

      <p>Задача:</p>



      <input v-model="name" :readonly=noChanging class="name">

      <p>Исполнитель: {{this.performer}}</p>




      <p>Описание задачи:</p>
      <textarea v-model="description" class="textarea" :readonly=noChanging></textarea>

      <button  @click="beginChanging">Изменить</button>
      <button  v-if="!noChanging" @click="this.noChanging = true">Отменить</button>
      <button  v-if="!noChanging" @click="changeData">Сохранить</button>



      <p v-if="isBegin">Время начала: {{this.beginDate}}</p>
      <p v-if="isEnd">Время конца: {{this.endDate}}</p>


      <div v-show="showModal">
        <div class="auth__modal-background">

        </div>
        <div  class="auth__modal-text-part">
          <p>{{this.textModal}}</p>
          <button class="auth__form-button">
            ПОНЯТНО
          </button>
        </div>
      </div>

      <button @click="this.noDeleting = false">Удалить</button>
      <button  v-if="!noDeleting" @click="this.noDeleting = true">Отменить удаление</button>
      <button  v-if="!noDeleting" @click="deleteData">Подтвердить удаление</button>
      <div>
        <p>Комментарии</p>
        <div>
          <p v-if="this.getComments.length === 0"> Комментариев пока что нет</p>
          <CommentUnit v-for="comment in this.getComments"
                            :key="comment.id"
                            :id="comment.id"
                            :text="comment.text"
                            :author="comment.author"
                            :date="comment.date"
                            :canChange="comment.canChange"
          >
          </CommentUnit>
        </div>


        <p>Оставить комментарий как {{this.login}}</p>
        <textarea  v-model="newComment"  maxlength="100" ></textarea>
        <button @click="comment">Оставить комментарий</button>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import router from "@/router";
import CommentUnit from "@/components/CommentUnit";

export default {
  name: "TaskPage",
  components: {CommentUnit},
  data(){
    return{
      login: '',
      id: '',
      name: '',
      description: '',
      performer: '',
      beginDate: '',
      endDate: '',
      status: '',
      statuses: [
          { text: 'Planned', value: 'Planned'},
          { text: 'In progress', value: 'In progress'},
          { text: 'Finished', value: 'Finished'},
          { text: 'Done', value: 'Done'}
      ],
      showModal: false,
      textModal: "",
      noChanging: true,
      isBegin: false,
      isEnd: false,
      newComment: '',
      noDeleting: true

    }
  },

  computed:{
    ...mapGetters(['getComments']),

  },
  methods:{
    ...mapActions(['getTask', 'addComment', 'updateTheTask', 'updateTheTaskStatus', 'deleteTheTask']),
    ...mapMutations(['addCommentToList', 'clearCommentsList']),
    beginChanging(){
      this.noChanging = false
    },
    changeData(){
      this.noChanging = true
      this.updateTheTask({
        userLogin: localStorage.getItem("login"),
        userPassword: localStorage.getItem("password"),
        projectId: localStorage.getItem("projectId"),
        taskId: localStorage.getItem("taskId"),
        name: this.name,
        description: this.description
      }).then(() => {
        this.getFreshData()
      }).catch(error =>{
        console.log(error)
      })
    },
    changeStatus(){
      this.noChanging = true
      this.updateTheTaskStatus({
        userLogin: localStorage.getItem("login"),
        userPassword: localStorage.getItem("password"),
        projectId: localStorage.getItem("projectId"),
        taskId: localStorage.getItem("taskId"),
        status: this.status
      }).then(() => {
        this.getFreshData()
      }).catch(error =>{
        console.log(error)
      })
    },
    comment(){
      if(!this.newComment.trim() == ''){
         this.addComment({
           userLogin: localStorage.getItem("login"),
           userPassword: localStorage.getItem("password"),
           projectId: localStorage.getItem("projectId"),
           taskId: localStorage.getItem("taskId"),
           text: this.newComment
         }).then(() =>{
           this.getFreshData()
           this.newComment = ''

         }).catch(error =>{
           console.log(error)
         })
      }

    },

    getFreshData(){
      this.clearCommentsList()
      this.login=localStorage.getItem("login")
      this.getTask({
        login: localStorage.getItem("login"),
        password: localStorage.getItem("password"),
        projectId: localStorage.getItem("projectId"),
        taskId: localStorage.getItem("taskId")
      }).then(response => {

        this.id = response.data.value.id
        this.name = response.data.value.name
        this.description = response.data.value.description
        this.beginDate = response.data.value.beginDate.split('T')[0] + ' ' + response.data.value.beginDate.split('T')[1].split('.')[0]
        this.endDate = response.data.value.endDate.split('T')[0] + ' ' + response.data.value.endDate.split('T')[1].split('.')[0]
        this.status = response.data.value.status
        this.performer = response.data.value.performer
        this.isBegin = this.beginDate !== '0001-01-01 00:00:00'
        this.isEnd = this.endDate !== '0001-01-01 00:00:00'

        response.data.value.comments.forEach(comment => {
          this.addCommentToList({
            id: comment.id,
            text: comment.text,
            author: comment.author,
            date: comment.date.split('T')[0] + ' ' + comment.date.split('T')[1].split('.')[0],
            canChange: localStorage.getItem("login") === comment.author
          })
        })

      }).catch(() => {
        router.push('/taskList')
      })

    },
    deleteData(){
      this.noDeleting = true
      this.deleteTheTask({
        userLogin: localStorage.getItem("login"),
        userPassword: localStorage.getItem("password"),
        projectId: localStorage.getItem("projectId"),
        taskId: localStorage.getItem("taskId")
      }).then(() => {
        router.push('/taskList')
      }).catch(error =>{
        console.log(error)
      })
    }

  },
  mounted() {
    this.getFreshData()

  }

}
</script>

<style scoped>

</style>