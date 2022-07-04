<template>
  <div class="kanban__unit" @dragstart="onDragStart($event, id)"
       draggable="true">
    <p>{{this.task_name}}</p>
    <p>Исполнитель: {{this.task_performer}}</p>
    <p>Всего комментариев: {{this.comments}}</p>
    <button class="button" style="--clr:#ffff00" @click="goToTask"><span>Подробнее</span><i></i></button>
  </div>
</template>

<script>
export default {
  name: "KanbanTaskUnit",
  props: ["id", "name", "performer", "userCount", "commentsCount", "status"],
  data(){
    return{
      task_id: this.id,
      task_name: this.name,
      task_performer: this.performer,
      comments: this.commentsCount,
      task_status: this.status
    }
  },
  methods:{
    goToTask(){
      localStorage.removeItem("taskId")
      localStorage.setItem("taskId", this.id)
      this.$router.push('/Task')
    },
    onDragStart(e, id)
    {
      e.dataTransfer.dropEffect = 'move'
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('taskId', id)
    },
  }
}
</script>

<style scoped>

</style>