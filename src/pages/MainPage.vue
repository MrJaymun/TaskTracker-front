<template>
  <div class="body">
    <div class="header">

      <div class="entered">
        <div class="entered__hello">
          <p>Вы вошли как {{this.login}}</p>
          <img src='@/assets/arrowdown.png' alt="Раскрыть список"/>
        </div>


        <div class="entered__buttons">
          <button class="button" style="--clr:#ffff00"><span>На главную</span><i></i></button>
          <button class="button" style="--clr:#ffff00" @click="$router.push('/changePassword')"><span>Изменить пароль</span><i></i></button>
          <button class="button" style="--clr:#ffff00" @click="$router.push('/createProject')"><span>Создать проект</span><i></i></button>
          <button class="button" style="--clr:#ffff00" @click="$router.push('/auth')"><span>Выйти</span><i></i></button>
        </div>
      </div>

    </div>

    <div class="list">

      <p>{{this.errorMessage}}</p>
      <p class="list__name">Ваши проекты</p>

      <div>
        <div class="list__filter">
          <p>Введите название проекта</p>
          <input v-model="filteredMy">
        </div>


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

      </div>

      <hr class="line">

      <div>


        <p class="list__name">Доступные проекты</p>


        <div class="list__filter">
        <p>Введите название проекта</p>
        <input v-model="filteredAvail">
        </div>

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