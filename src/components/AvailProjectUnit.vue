<template>
  <div>
    <p>{{this.project_name}}</p>
    <p>Создатель : {{this.project_author}}</p>
    <p>Пользователей на проекте: {{this.userCount}}</p>
    <button @click="watchProject">Посмотреть</button>
  </div>
</template>

<script>

export default {
  name: "AvailProjectUnit",
  props: ["id", "name", "author", "userCount"],
  data(){
    return{
      project_id: this.id,
      project_name: this.name,
      project_author: this.author,
      usersCount: this.userCount
    }
  },
  methods:{
    watchProject(){
      localStorage.removeItem("watchId")
      localStorage.setItem("watchId", this.id)
      this.$router.push('/watchProject')
    }
  }
}
</script>

<style scoped>

</style>