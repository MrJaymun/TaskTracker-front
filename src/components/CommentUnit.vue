<template>
  <div>
    <p>Автор: {{this.comment_author}}</p>
    <p>Дата: {{this.comment_date}}</p>
    <textarea v-model="comment_text" class="textarea" :readonly=noChanging></textarea>
    <button  v-if="letChange" @click="beginChanging">Изменить</button>
    <button  v-if="!noChanging" @click="this.noChanging = true">Отменить</button>
    <button  v-if="!noChanging" @click="changeData">Сохранить</button>
    <button v-if="letChange" @click="this.deleting = true">Удалить</button>
    <button v-if="deleting" @click="this.deleting = false">Отменить удаление</button>
    <button v-if="deleting" @click="deleteCom">Подтвердить удаление</button>
  </div>
</template>

<script>

import {mapActions} from "vuex";

export default {
  name: "CommentUnit",
  props: ["id", "text", "author", "date", "canChange"],
  data(){
    return{
      comment_id: this.id,
      comment_text: this.text,
      comment_author: this.author,
      comment_date: this.date,
      letChange: this.canChange,
      noChanging: true,
      deleting: false

    }
  },
  methods:{
    ...mapActions(['updateComment', 'deleteComment']),
    beginChanging(){
      this.noChanging = false
    },
    changeData(){
      this.noChanging = true
      if(!this.comment_text.trim() == ''){
        this.updateComment({
          userLogin: localStorage.getItem("login"),
          userPassword: localStorage.getItem("password"),
          projectId: localStorage.getItem("projectId"),
          taskId: localStorage.getItem("taskId"),
          commentId: this.comment_id,
          text: this.comment_text
        }).then(() =>{
          this.$parent.getFreshData()
        }).catch(error => {
          console.log(error)
        })
      }
    },
    deleteCom(){
      this.deleteComment({
        userLogin: localStorage.getItem("login"),
        userPassword: localStorage.getItem("password"),
        projectId: localStorage.getItem("projectId"),
        taskId: localStorage.getItem("taskId"),
        commentId: this.comment_id
      }).then(() =>{
        this.$parent.getFreshData()
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>

</style>