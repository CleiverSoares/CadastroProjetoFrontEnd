


import { createRouter, createWebHistory } from 'vue-router'
import CadastrarPessoa from '../views//CadastrarPessoa.vue'
import pessoas  from '../views/Pessoas.vue'
import teste  from '../components/ModalPessoas.vue'

const routes = [
  {
    path: '/pessoas',
    name: 'pessoas',
    component: pessoas
  },
  {
    path: '/cadastrar-pessoa',
    name: 'cadastrar-pessoa',
    component: CadastrarPessoa
  },
  {
    path: '/teste',
    name: 'teste',
    component: teste
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
