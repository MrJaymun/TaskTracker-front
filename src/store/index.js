import { createStore } from 'vuex'
import {addUser, changeUserPassword, checkUser} from "@/api/users";
import {
  addProject,
  getProjects,
  watchProject,
  joinProject,
  goProject,
  changeProject,
  removeProject
} from "@/api/projects";
import {addTask, deleteTask, getTaskList, getTheTask, updateTask, updateTaskStatus} from "@/api/tasks";
import {createComment, deleteTheComment, updateTheComment} from "@/api/comments";

export default createStore({
  state: {
    login: '',
    password: '',
    myProjectList: [],
    availProjectList: [],
    taskList: [],
    commentsList: []
  },
  getters: {
    getLogin(state){
      return state.login
    },
    getPassword(state){
      return state.password
    },

    getMyProjects(state){
      return state.myProjectList
    },
    getAvailProjects(state){
      return state.availProjectList
    },
    getTaskList(state){
      return state.taskList
    },

    getPlannedTasks(state){
      return state.taskList.filter(x => x.status === "Planned")
    },
    getActiveTasks(state){
      console.log(state.taskList)
      return state.taskList.filter(x => x.status === "In progress")
    },
    getFinishedTasks(state){
      return state.taskList.filter(x => x.status === "Finished")
    },

    getComments(state){
      return state.commentsList
    }
  },
  mutations: {
    addInfoAboutUser(state, payload) {
      state.login = payload.login
      state.password = payload.password
      localStorage.setItem('login', payload.login)
      localStorage.setItem('password', payload.password)
    },

    addProjectToMyList(state, payload) {
      state.myProjectList.push({
        id: payload.id,
        name: payload.name,
        author: payload.author,
        isPersonal: payload.isPersonal,
        userCount: payload.userCount
      })
    },

    addProjectToAvailList(state, payload) {
      state.availProjectList.push({
        id: payload.id,
        name: payload.name,
        author: payload.author,
        userCount: payload.userCount
      })
    },

    addTaskToList(state, payload) {
      state.taskList.push({
        id: payload.id,
        name: payload.name,
        performer: payload.performer,
        beginDate: payload.beginDate,
        endDate: payload.endDate,
        commentsCount: payload.commentsCount,
        status: payload.status
      })
    },
    addCommentToList(state, payload) {
      state.commentsList.push({
        id: payload.id,
        text: payload.text,
        author: payload.author,
        date: payload.date,
        canChange: payload.canChange

      })
    },

    clearAvailProjects(state){
      state.availProjectList = []
    },

    clearMyProjects(state){
      state.myProjectList = []
    },

    clearTaskList(state){
      state.taskList = []
    },
    clearCommentsList(state){
      state.commentsList = []
    }

  },
  actions: {
    // eslint-disable-next-line no-unused-vars
    async createUser({commit}, payload){
      let result = (await addUser(payload));
      return result
    },
    // eslint-disable-next-line no-unused-vars
    async createProject ({commit}, payload){
      let result = (await addProject(payload));
      return result
    },
    // eslint-disable-next-line no-unused-vars
    async checkUser ({commit}, payload){
      let result = (await checkUser(payload));
      return result
    },

    // eslint-disable-next-line no-unused-vars
    async changePassword ({commit}, payload){
      let result = (await changeUserPassword(payload));
      return result
    },
    // eslint-disable-next-line no-unused-vars
    async getAllProjects ({commit}, payload){
      let result = (await getProjects(payload));
      return result
    },
    // eslint-disable-next-line no-unused-vars
    async watchTheProject ({commit}, payload){
      let result = (await watchProject(payload));
      return result
    },
    // eslint-disable-next-line no-unused-vars
    async joinTheProject ({commit}, payload){
      let result = (await joinProject(payload));
      return result
    },
    // eslint-disable-next-line no-unused-vars
    async goToProject ({commit}, payload){
      let result = (await goProject(payload));
      return result
    },
    // eslint-disable-next-line no-unused-vars
    async changeTheProject ({commit}, payload){
      let result = (await changeProject(payload));
      return result
    },

    // eslint-disable-next-line no-unused-vars
    async createTask ({commit}, payload){
      let result = (await addTask(payload));
      return result
    },
    // eslint-disable-next-line no-unused-vars
    async getTasks ({commit}, payload){
      let result = (await getTaskList(payload));
      return result
    },
    // eslint-disable-next-line no-unused-vars
    async getTask ({commit}, payload){
      let result = (await getTheTask(payload));
      return result
    },
    // eslint-disable-next-line no-unused-vars
    async addComment ({commit}, payload){
      let result = (await createComment(payload));
      return result
    },
    // eslint-disable-next-line no-unused-vars
    async updateComment ({commit}, payload){
      let result = (await updateTheComment(payload));
      return result
    },
    // eslint-disable-next-line no-unused-vars
    async deleteComment ({commit}, payload){
      let result = (await deleteTheComment(payload));
      return result
    },
    // eslint-disable-next-line no-unused-vars
    async updateTheTask ({commit}, payload){
      let result = (await updateTask(payload));
      return result
    },
    // eslint-disable-next-line no-unused-vars
    async updateTheTaskStatus ({commit}, payload){
      let result = (await updateTaskStatus(payload));
      return result
    },
    // eslint-disable-next-line no-unused-vars
    async deleteTheTask ({commit}, payload){
      let result = (await deleteTask(payload));
      return result
    },
    // eslint-disable-next-line no-unused-vars
    async deleteProject ({commit}, payload){
      let result = (await removeProject(payload));
      return result
    }


  },
  modules: {
  }
})
