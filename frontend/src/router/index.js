import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import CreateSurvey from '../views/CreateSurvey.vue';
import SurveyDetails from '../views/SurveyDetails.vue';
import PublicResponse from '../views/PublicResponse.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/survey/create',
    name: 'CreateSurvey',
    component: CreateSurvey,
    meta: { requiresAuth: true }
  },
  {
    path: '/survey/:id',
    name: 'SurveyDetails',
    component: SurveyDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/s/:publicLink',
    name: 'PublicResponse',
    component: PublicResponse
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else if ((to.name === 'Login' || to.name === 'Register') && token) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;