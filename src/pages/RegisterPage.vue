<template>
  <div>
    <form @submit.prevent="tryToRegister">
      <p>Логин<input v-model="login" placeholder="Английские буквы и цифры" minlength="5" maxlength="20"></p>
      <p>Пароль<input type="password" v-model="password" placeholder="Английские буквы и цифры" minlength="5" maxlength="20"></p>
      <p>Повторите пароль<input type="password" v-model="repeatPassword" placeholder="Английские буквы и цифры" minlength="5" maxlength="20"></p>
      <button type="submit">РЕГИСТРАЦИЯ</button>
      <button @click="$router.push('/auth')">К авторизации</button>
    </form>
    <div v-show="showModal">
      <div class="auth__modal-background">

      </div>
      <div>
        <p>{{this.textModal}}</p>
        <button v-show="isBad" @click="closeModal">
        ПОНЯТНО
        </button>
        <button v-show="isAdded" @click="goToAuth">
          ОТЛИЧНО
        </button>
      </div>
    </div>
  </div>
</template>

<script>

import {mapActions} from 'vuex';

export default {
  name: "AuthPage",

  data(){
    return{
      login: "",
      password: "",
      repeatPassword: "",
      showModal: false,
      textModal: "",
      isAdded: false,
      isBad: false
    }
  },

  methods:{
    ...mapActions(['createUser']),


    tryToRegister(){
      const regex = /^[A-Za-z0-9\s]+$/;
      const matchLogin = regex.exec(this.login);
      if(!matchLogin){
        this.showModal = true;
        this.isBad = true;
        this.textModal = 'Введен некорректный логин';
      }
      else{
        const matchPassword = regex.exec(this.password);
        if(!matchPassword){
          this.showModal = true;
          this.isBad = true;
          this.textModal = 'Введен некорректный пароль';
        }
        else{
          if(this.repeatPassword !== this.password){
            this.showModal = true;
            this.isBad = true;
            this.textModal = 'Пароли не совпадают';
          }
          else{
            this.createUser(
                {
                  NewUserLogin: this.login,
                  NewUserPassword: this.password
                }
            ).then(response => {
              this.textModal = response.data.value;
                this.showModal = true;
                this.isAdded = true;
                this.isBad = false;
            })
            .catch(error => {
              this.showModal = true;
              this.isAdded = false;
              this.isBad = true;
              this.textModal = error.response.data;
            })

          }
        }
      }
    },
    closeModal(){
      this.showModal = false;
    },
    goToAuth(){
      this.$router.push('/auth')
    }
  },
  mounted() {
    localStorage.clear()
  }

}
</script>

<style scoped>

</style>