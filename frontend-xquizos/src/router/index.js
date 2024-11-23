import { createRouter, createWebHistory } from 'vue-router';

import Login from '../components/Login.vue'; 
import Editor from '../components/EditorView.vue';
import VistaAdministrador from '@/views/VistaAdministrador.vue';
import VistaDocente from '@/views/VistaDocente.vue';
import temp from '@/views/temp.vue';
import GestorDatos from '@/views/GestorDatos.vue';
import GestorAlumnos from '@/views/GestorAlumnos.vue';
import GestorDocentes from '@/views/GestorDocentes.vue';
import GestorCursos from '@/views/GestorCursos.vue';
import VistaAlumnos from '@/views/VistaAlumnos.vue';
import PerfilAlumno from '@/views/PerfilAlumno.vue';

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/editor',
    name: 'Editor',
    component: Editor
  },
  {
    path: '/vistaAdministrador',
    name: 'VistaAdministrador',
    component: VistaAdministrador
  },
  {
    path: '/vistaDocente',
    name: 'VistaDocente',
    component: VistaDocente
  },
  {
    path: '/VistaAlumnos/:nombreCurso/:seccionCurso',
    name: 'VistaAlumnos',
    component: VistaAlumnos,
  },
  {
    path: '/temp',
    name: 'temp',
    component: temp
  },
  {
    path: '/gestorDatos',
    name: 'GestorDatos',
    component: GestorDatos,
    props: true
  },
  {
    path: '/gestorAlumnos',
    name: 'GestorAlumnos',
    component: GestorAlumnos
  },
  {
    path: '/gestorDocentes',
    name: 'GestorDocentes',
    component: GestorDocentes
  },
  {
    path: '/gestorCursos',
    name: 'GestorCursos',
    component: GestorCursos
  },
  { 
    path: '/perfilalumno',
    name: 'PerfilAlumno',
    component: PerfilAlumno,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;