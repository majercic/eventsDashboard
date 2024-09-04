import { createRouter, createWebHistory } from 'vue-router'
import HomeComponent from '@/views/HomeView';
import CreateComponent from '@/components/event/CreateEvent';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: { name: 'home' } },
    { path: '/home', name: 'home', component: HomeComponent },
    { path: '/create', name: 'Create', component: CreateComponent, props: { isEdit: false } },
    { path: '/edit/:id', name: 'Edit', component: CreateComponent, props: { isEdit: true } }
  ]
})

export default router