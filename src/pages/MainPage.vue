<template>
  <div>
    <div>
      <p>Вы вошли как {{this.login}}</p>
      <button>На главную</button>
      <button @click="$router.push('/changePassword')">Изменить пароль</button>
      <button @click="$router.push('/createProject')">Создать проект</button>
      <button @click="$router.push('/auth')">Выйти</button>
    </div>
    <div>

      <p>{{this.errorMessage}}</p>

      <p>Введите название проекта</p>
      <input v-model="filteredMy">

      <div>
        <MyProjectUnit v-for="project in this.filterMy"
                :key="project.id"
                :id="project.id"
                :name="project.name"
                :author="project.author"
                :userCount="project.userCount"
                :isPersonal="project.isPersonal"
        >
        </MyProjectUnit>
      </div>
      <p>Доступные проекты</p>
      <p>Введите название проекта</p>
      <input v-model="filteredAvail">
      <div>
        <AvailProjectUnit v-for="project in this.filterAvail"
                       :key="project.id"
                       :id="project.id"
                       :name="project.name"
                       :author="project.author"
                       :userCount="project.userCount"
        >
        </AvailProjectUnit>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters,mapActions, mapMutations} from "vuex";
import AvailProjectUnit from "@/components/AvailProjectUnit";
import MyProjectUnit from "@/components/MyProjectUnit";
export default {
  components: {AvailProjectUnit, MyProjectUnit},
  ...mapGetters(['getLogin', 'getPassword']),


  name: "MainPage",
  data(){
    return{
      login: '',
      errorMessage: '',
      filteredMy: '',
      filteredAvail: ''
    }
  },

  computed:{
    ...mapGetters(['getAvailProjects', 'getMyProjects']),
    filterMy(){
      return this.getMyProjects.filter( filter => {
            if (this.filteredMy.trim() === '') {
              return filter
            }
            else{
              return filter.name.toLowerCase().indexOf(this.filteredMy.toLowerCase()) !== -1;
            }
          }

      )

    },
    filterAvail(){
      return this.getAvailProjects.filter( filter => {
            if (this.filteredMy.trim() === '') {
              return filter
            }
            else{
              return filter.name.toLowerCase().indexOf(this.filteredAvail.toLowerCase()) !== -1;
            }
          }

      )
    }
  },

  methods:{

    ...mapMutations(['addProjectToMyList', 'addProjectToAvailList', 'clearMyProjects', 'clearAvailProjects']),
    ...mapActions(['checkUser', 'getAllProjects']),



    fullLists(){
      this.clearMyProjects()
      this.clearAvailProjects();

      this.getAllProjects({
        login: localStorage.getItem("login"),
        password: localStorage.getItem("password")
      }).then(response => {
        if(response.status == 200){

          response.data.value.forEach(project =>{
            if(project.isUserIn === true){
                this.addProjectToMyList({
                  id: project.id,
                  name: project.name,
                  author: project.author,
                  isPersonal: project.isPersonal,
                  userCount: project.usersCount
                })
            }
            if(project.isUserIn === false){
                this.addProjectToAvailList({
                  id: project.id,
                  name: project.name,
                  author: project.author,
                  userCount: project.usersCount
                })
            }
          })

        }
      }).catch(error => {
          this.errorMessage = error;

      })
    }
  },

  mounted() {
    this.login=localStorage.getItem("login")
    this.fullLists();
  }


}
</script>

<style scoped>

</style>