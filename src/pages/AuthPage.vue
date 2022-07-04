<template>
  <div class="page-form">
  <div>
  <form v-show="!showModal" @submit.prevent="tryToLogin">
    <p>Логин<input v-model="login"  minlength="5" maxlength="12"></p>
    <p>Пароль<input v-model="password"  type="password" minlength="5" maxlength="20"></p>
    <button class="button" type="submit" style="--clr:#ffff00"><span>Войти</span><i></i></button>
    <button class="button " style="--clr:#ffff00" @click="$router.push('/register')"><span>К регистрации</span><i></i></button>
  </form>
  <div v-show="showModal">
    <div class="modal-background">

    </div>
    <div class="modal-text-part">

        <p>{{this.textModal}}</p>
        <button class="button" style="--clr:#00ff00"  @click="closeModal">
          <span>Понятно</span><i></i>
        </button>

    </div>
  </div>

  </div>
  </div>
</template>

<script>
import {mapActions, mapMutations} from "vuex";

export default {
  name: "AuthPage",

  data(){
    return{
      login: "",
      password: "",
      showModal: false,
      textModal: ""
    }
  },

  methods:{
    ...mapActions(['checkUser']),
    ...mapMutations(['addInfoAboutUser']),

    tryToLogin(){
      const regex = /^[A-Za-z0-9\s]+$/;
      const matchLogin = regex.exec(this.login);
      if(!matchLogin){
        this.showModal = true;
        this.textModal = 'Введен некорректный логин';
      }
      else{
        const matchPassword = regex.exec(this.password);
        if(!matchPassword){
          this.showModal = true;
          this.textModal = 'Введен некорректный пароль';
        }
        else{
          this.checkUser(
              {
                login: this.login,
                password: this.password
              }
          ).then(response => {

              if(response.status === 200){
                this.addInfoAboutUser({
                  login: this.login,
                  password: this.password
                })
                this.$router.push('/')
              }
              else{
                this.showModal = true;
                this.textModal = 'Неправильный логин или пароль';
              }

          })
              .catch(error => {
                this.showModal = true;
                this.textModal = error.response.data;
              })
        }
      }
    },
    closeModal(){
      this.showModal = false;
    }
  },
  mounted() {
    localStorage.clear()
  }

}
</script>

<style>

</style>