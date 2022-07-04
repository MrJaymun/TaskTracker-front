<template>
  <div class="list__unit">
    <p>{{this.project_name}}</p>
    <p>Создатель : {{this.project_author}}</p>
    <p v-if="isPer">Это ваш личный проект</p>
    <p v-if="!isPer">Пользователей на проекте: {{this.userCount}}</p>
    <button class="button list-button" style="--clr:#ffff00" @click="goToProject"><span>Открыть</span><i></i></button>
  </div>
</template>

<script>
export default {
  name: "MyProjectUnit",
  props: ["id", "name", "author", "userCount", "isPersonal"],
  data(){
    return{
      project_id: this.id,
      project_name: this.name,
      project_author: this.author,
      isPer: this.isPersonal,
      usersCount: this.userCount

    }
  },
  methods:{
    goToProject(){
      localStorage.removeItem("projectId")
      localStorage.setItem("projectId", this.id)
      this.$router.push('/ProjectMain')
    }
  }
}
</script>

<style scoped>

</style>