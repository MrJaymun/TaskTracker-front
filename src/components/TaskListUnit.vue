<template>
  <div>
    <p>{{this.task_name}}</p>
    <p>Статус: {{this.task_status}}</p>
    <p>Исполнитель: {{this.task_performer}}</p>
    <p v-if="this.beginDate !== '0001-01-01T00:00:00'">Начало: {{this.beginDate.split('T')[0] + ' ' +this.beginDate.split('T')[1].split('.')[0] }}</p>
    <p v-if="this.endDate !== '0001-01-01T00:00:00'">Конец: {{this.endDate.split('T')[0] + ' ' +this.endDate.split('T')[1].split('.')[0] }}</p>
    <p>Всего комментариев: {{this.comments}}</p>
    <button @click="goToTask">Подробнее</button>
  </div>
</template>

<script>
export default {
  name: "TaskListUnit",
  props: ["id", "name", "performer", "userCount", "beginDate", "endDate", "commentsCount", "status"],
  data(){
    return{
      task_id: this.id,
      task_name: this.name,
      task_performer: this.performer,
      begin: this.beginDate,
      end: this.endDate,
      comments: this.commentsCount,
      task_status: this.status

    }
  },
  methods:{
    goToTask(){
      localStorage.removeItem("taskId")
      localStorage.setItem("taskId", this.id)
      this.$router.push('/Task')
    }
  }
}
</script>

<style scoped>

</style>