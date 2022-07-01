<template>
  <div @dragstart="onDragStart($event, id)"
       draggable="true">
    <p>{{this.task_name}}</p>
    <p>Статус: {{this.task_status}}</p>
    <p>Исполнитель: {{this.task_performer}}</p>
    <p>Всего комментариев: {{this.comments}}</p>
    <button @click="goToTask">Подробнее</button>
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