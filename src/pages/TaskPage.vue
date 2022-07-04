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
          <button data-text="Список задач" @click="$router.push('/taskList')">Список задач</button>
        </div>

        <div class="project-nav  balancer" v-if="hideNav">
        </div>
      </div>

      <div class="info-page">
         <div class="form-wide-select">
            <p>Статус:</p>
           <select v-model="status" class="form-wide-select-huge">
                <option v-for="status in this.statuses" v-bind:value="status.value" v-bind:key="status.value">
                    {{status.text}}
                </option>
            </select>
          </div>

        <button  class="button confirm-button" style="--clr:#ffff00" @click="changeStatus"> <span>Подтвердить новый статус</span><i></i></button>

        <p  class="info-page__block-name">Задача</p>
        <input class="name" v-model="name" :readonly=noChanging minlength="3" maxlength="50">


      <p>Исполнитель: {{this.performer}}</p>




        <p class="info-page__block-name">Описание задачи</p>
      <textarea v-model="description" class="textarea" :readonly=noChanging minlength="5" maxlength="500"></textarea>

        <div  class="data-changing">
          <button class="button data-changing-button" style="--clr:#ffff00" v-if="noChanging" @click="beginChanging"><span>Изменить</span><i></i></button>
          <div class="buttons-decision" v-if="!noChanging">
            <button class="button decision-button" style="--clr:#ffff00" @click="this.noChanging = true"><span>Отменить изменения</span><i></i></button>
            <button class="button decision-button" style="--clr:#ffff00"  @click="changeData"><span>Сохранить изменения</span><i></i></button>
          </div>

          <button class="button data-changing-button" data-changing-button style="--clr:#ffff00"  v-if="noDeleting" @click="this.noDeleting = false"><span>Удалить</span><i></i></button>

          <div class="buttons-decision" v-if="!noDeleting">
            <button class="button decision-button" style="--clr:#ffff00"  @click="this.noDeleting = true"><span>Отменить удаление</span><i></i></button>
            <button class="button decision-button" style="--clr:#ffff00"   @click="deleteData"><span>Подтвердить удаление</span><i></i></button>
          </div>
        </div>



        <p v-if="isBegin">Время начала: {{this.beginDate}}</p>
        <p v-if="isEnd">Время конца: {{this.endDate}}</p>
      </div>




      <div class="list bottom">
        <p  class="info-page__block-name">Комментарии</p>
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
        <textarea  class="textarea-comment" v-model="newComment"  maxlength="200" ></textarea>
        <button class="button comment-button" style="--clr:#ffff00" @click="comment"><span>Оставить комментарий</span><i></i></button>
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

      noChanging: true,
      isBegin: false,
      isEnd: false,
      newComment: '',
      noDeleting: true,
      hideNav: false

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