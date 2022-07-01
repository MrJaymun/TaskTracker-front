import { createRouter, createWebHistory } from 'vue-router'

import AuthPage from "@/pages/AuthPage";
import RegisterPage from "@/pages/RegisterPage";
import MainPage from "@/pages/MainPage";
import store from '../store'

import {checkUser} from "@/api/users";
import ChangePasswordPage from "@/pages/ChangePasswordPage";
import CreateProjectPage from "@/pages/CreateProjectPage";
import WatchProjectPage from "@/pages/WatchProjectPage";
import ProjectMainPage from "@/pages/ProjectMainPage";
import CreateTaskPage from "@/pages/CreateTaskPage";
import ProjectTasksPage from "@/pages/ProjectTasksPage";
import TaskPage from "@/pages/TaskPage";
import KanbanPage from "@/pages/KanbanPage";

const routes = [
  {
    path: '/',
    name: 'Main',
    component: MainPage,

  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthPage
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage
  },
  {
    path: '/createProject',
    name: 'CreateProject',
    component: CreateProjectPage
  },
  {
    path: '/changePassword',
    name: 'ChangePassword',
    component: ChangePasswordPage
  },
  {
    path: '/watchProject',
    name: 'WatchProject',
    component: WatchProjectPage
  },
  {
    path: '/projectMain',
    name: 'ProjectMain',
    component: ProjectMainPage
  },
  {
    path: '/createTask',
    name: 'CreateTask',
    component: CreateTaskPage
  },
  {
    path: '/taskList',
    name: 'TaskList',
    component: ProjectTasksPage
  },
  {
    path: '/task',
    name: 'Task',
    component: TaskPage
  },
  {
    path: '/kanban',
    name: 'Kanban',
    component: KanbanPage
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if(to.name!=='Auth' && to.name!=='Register'){
    checkUser({login: store.getters.getLogin, password: store.getters.getPassword})
        .then(() => next())
        .catch(() => next('/auth'))
  }
  else{
    next()
  }
})

export default router
