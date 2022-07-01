<template>
  <div class="body">
  <form @submit.prevent="tryToLogin">
    <p>Логин<input v-model="login" placeholder="Английские буквы и цифры" minlength="5" maxlength="20"></p>
    <p>Пароль<input v-model="password"  type="password" placeholder="Английские буквы и цифры" minlength="5" maxlength="20"></p>
    <button type="submit">Войти</button>
    <button @click="$router.push('/register')">К регистрации</button>
  </form>
  <div v-show="showModal">
    <div class="auth__modal-background">

    </div>
    <div  class="auth__modal-text-part">
      <p>{{this.textModal}}</p>
      <button class="auth__form-button" @click="closeModal()">
        ПОНЯТНО
      </button>
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

<style scoped>

</style>