<template>
  <div >
    <div class="header" v-show="!showModal">

      <div class="entered">
        <div class="entered__hello">
          <p>Вы вошли как {{this.login}}</p>
          <img src='@/assets/arrowdown.png' alt="Раскрыть список"/>
        </div>


        <div class="entered__buttons">
          <button class="button" style="--clr:#ffff00" @click="$router.push('/')"><span>На главную</span><i></i></button>
          <button class="button" style="--clr:#ffff00" @click="$router.push('/changePassword')"><span>Изменить пароль</span><i></i></button>
          <button class="button" style="--clr:#ffff00" @click="$router.push('/createProject')"><span>Создать проект</span><i></i></button>
          <button class="button" style="--clr:#ffff00" @click="$router.push('/auth')"><span>Выйти</span><i></i></button>
        </div>
      </div>

    </div>
    <div  class="page-form">
      <form v-show="!showModal" @submit.prevent="tryToLogin" class="change-password">
        <p>Старый пароль<input type="password" v-model="password"  minlength="5" maxlength="20"></p>
        <p>Новый пароль<input type="password" v-model="newPassword"  minlength="5" maxlength="20"></p>
        <p>Повторите новый пароль<input type="password" v-model="newPasswordAgain" minlength="5" maxlength="20"></p>
        <button class="button" style="--clr:#ffff00"  type="submit"><span>Изменить пароль</span><i></i></button>
      </form>

      <div v-show="showModal">
        <div class="modal-background">

        </div>
        <div class="modal-text-part">
          <p>{{this.textModal}}</p>
          <button class="button" style="--clr:#00ff00"  @click="closeModal()">
            <span>Понятно</span><i></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "ChangePasswordPage",
  data(){
    return{
      login: '',
      showModal: false,
      textModal: "",
      password: '',
      newPassword: '',
      newPasswordAgain: '',
    }
  },
  methods:{
    ...mapActions(['checkUser', 'changePassword']),
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
          const matchNewPassword = regex.exec(this.newPassword);
          if(!matchNewPassword){
            this.showModal = true;
            this.textModal = 'Новый пароль некорректен';
          }
          else{
            if(this.newPassword !== this.newPasswordAgain){
              this.showModal = true;
              this.textModal = 'Пароли не совпадают';
            }
            else{
              this.checkUser(
                  {
                    login: localStorage.getItem("login"),
                    password: this.password
                  }
              ).then(response => {

                if(response.status === 200){

                  this.showModal = true;
                  this.changePassword({
                    userLogin: localStorage.getItem("login"),
                    userPassword: localStorage.getItem("password"),
                    userNewPassword: this.newPassword
                  }).then(()=> {

                      this.textModal = 'Пароль был успешно изменен';
                      localStorage.removeItem("password")
                      localStorage.setItem("password", this.newPassword)


                  }).catch(error => {
                    this.textModal = error.response.data;
                  })

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

        }
      }
    },
    closeModal(){
      this.showModal = false;
    }
  },
  mounted() {
    this.login=localStorage.getItem("login")
  }
}
</script>

<style scoped>

</style>