<template>
  <nav class="navbar">
    <div class="navbar-logo">
      <img src="../assets/school.svg" alt="Logo" />
      <span>{{ userRole }}</span>
    </div>
    <ul class="navbar-links" :class="{ 'navbar-links-mobile': isMobileMenuOpen }">
      <li class="navbar-item"><a href="#" @click="irAInicio">Inicio</a></li>

      <!-- Solo mostrar si isAdmin es true -->
      <li v-if="isAdmin" class="navbar-item"><a href="#" @click="GestorAlumnos">Alumnos</a></li>
      <li v-if="isAdmin" class="navbar-item"><a href="#" @click="GestorDocentes">Docentes</a></li>
      <li v-if="isAdmin" class="navbar-item"><a href="#" @click="GestorCursos">Cursos</a></li>
      <li v-if="isAdmin" class="navbar-item"><a href="#" @click="GestorCursosPeriodo">Cursos Periodo</a></li>
      
    </ul>
    <div class="navbar-toggle" @click="toggleMobileMenu">
      <span class="navbar-toggle-icon"></span>
    </div>
    <div class="navbar-profile"> 
      <span >{{ userName }}</span>
      <Profile class="Profile"/>
    </div>
  </nav>
</template>

<script>
import Profile from '@/components/Profile.vue';

export default {
  name: 'AppNavbar',
  components: {
    Profile
  },
  computed: {
    userName() {
      return localStorage.getItem('user') || sessionStorage.getItem('user') || 'Usuario';
    },
    userRole() {
      const isAdmin = localStorage.getItem('isAdmin') || sessionStorage.getItem('isAdmin');
      return isAdmin === 'true' ? 'Administrador' : 'Docente';
    },
    // Computed property para verificar si el usuario es admin
    isAdmin() {
      return localStorage.getItem('isAdmin') === 'true' || sessionStorage.getItem('isAdmin') === 'true';
    }
  },
  methods: {
    cerrarSesion() {
      localStorage.removeItem('email');
      localStorage.removeItem('user');
      localStorage.removeItem('isAdmin');
      sessionStorage.removeItem('email');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('isAdmin');
      this.$router.push('/');
    },
    irAInicio() {
      const isAdmin = localStorage.getItem('isAdmin') || sessionStorage.getItem('isAdmin');
      if (isAdmin === 'true') {
        this.$router.push({ name: 'VistaAdministrador' });
      } else {
        this.$router.push({ name: 'VistaDocente' });
      }
    },
    GestorAlumnos() {
      this.$router.push({ name: 'GestorAlumnos' });
    },
    GestorDocentes() {
      this.$router.push({ name: 'GestorDocentes' });
    },
    GestorCursos() {
      this.$router.push({ name: 'GestorCursos' });
    },
    GestorCursosPeriodo() {
      this.$router.push({ name: 'GestorCursosPeriodo' });
    },
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }
  },
  data() {
    return {
      isMobileMenuOpen: false
    };
  }
}
</script>

<style scoped>
.navbar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 20px 50px;
  color: #333;
  position: fixed;
  top: 0;
  height: 80px;
  box-sizing: border-box;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 9999;
}

.navbar-logo {
  display: flex;
  align-items: center;
}


.navbar-logo img {
  height: 40px;
  margin-right: 10px;
}

.navbar-links {
  list-style: none;
  display: flex;
  gap: 20px;
  justify-content: center;
  margin: 0;
  flex: 1;
  justify-content: center; /* Center the links horizontally */
}

.navbar-links li {
  display: inline;
}
.navbar-links a {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  padding: 12px 18px; /* Tamaño ligeramente más grande */
  border: 1px solid #d3d3d3; /* Borde gris */
  border-radius: 15px; /* Forma redondeada */
  transition: background-color 0.3s ease, color 0.3s ease;
}

.navbar-links a:hover {
  background-color: #d3d3d3; /* Color gris al pasar el mouse */
  color: #000;
}

.navbar-links a.active {
  font-weight: bold;
  background-color: #007bff;
  color: #fff;
}

.navbar-toggle {
  display: none;
  cursor: pointer;
}

.navbar-toggle-icon {
  width: 25px;
  height: 3px;
  background-color: #333;
  display: block;
  margin: 5px 0;
}
.navbar span {
  margin-left:10px;
  font-size: 1rem;
  font-weight: 500;
  color: #333;
}
.navbar-logo span {
  margin-left: 10px;
  font-size: 1rem;
  font-weight: 500;
  color: #555;
  text-transform: capitalize;
}

.navbar-profile {
  display: flex;
  align-items: center;
  gap: 10px;
}
.navbar-profile span {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
}

.Profile {
  margin-left: 5px;
}

@media (max-width: 768px) {
  .navbar {
    padding: 10px 20px;
  }

  .navbar-links {
    display: none;
    flex-direction: column;
    gap: 10px;
    position: absolute;
    top: 80px;
    left: 0;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .navbar-links.navbar-links-mobile {
    display: flex;
  }

  .navbar-toggle {
    display: block;
  }
}
</style>
