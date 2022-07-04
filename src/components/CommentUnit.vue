<template>
  <div class="list__unit">
    <p>Автор: {{this.comment_author}}</p>
    <p>Дата: {{this.comment_date}}</p>
    <textarea v-model="comment_text" class="textarea-comment" :readonly=noChanging maxlength="200"></textarea>
    <button class="button comment-button" style="--clr:#ffff00" v-if="letChange && noChanging" @click="beginChanging"><span>Изменить</span><i></i></button>
    <button class="button comment-button"  style="--clr:#ffff00" v-if="!noChanging" @click="this.noChanging = true"><span>Отменить изменения</span><i></i></button>
    <button class="button comment-button" style="--clr:#ffff00" v-if="!noChanging" @click="changeData"><span>Сохранить изменения</span><i></i></button>
    <button class="button comment-button" style="--clr:#ffff00" v-if="letChange && !deleting" @click="this.deleting = true"><span>Удалить</span><i></i></button>
    <button class="button comment-button" style="--clr:#ffff00" v-if="deleting" @click="this.deleting = false"><span>Отменить удаление</span><i></i></button>
    <button class="button comment-button" style="--clr:#ffff00" v-if="deleting" @click="deleteCom"><span>Подтвердить удаление</span><i></i></button>
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