<template>
<navBar />

<div class="maincontent">

    <div class="gestor-docentes-container">
        <!-- Botón de retroceso y título -->
        <div class="header-container">
            <button class="btn btn-secondary back-button" @click="goBack">
                <i class="fa-solid fa-circle-left"></i> Volver a GestorDatos
            </button>
            <h1 class="title">{{ nombreCurso }} - {{ seccionCurso }}</h1>
        </div>

        <!-- Lista de docentes con botones de acción -->
        <div class="section-title">
            <h3>Lista de Alumnos</h3>

            <div class="action-buttons">   
                <button class="btn btn-success" @click="GenerateExcel">
                    <i class="fa-solid fa-file-csv"></i> Exportar Alumnos en Excel
                </button>
              <button class="btn btn-success" @click="gotoEstadisticas">
                <i class="fa-solid fa-chart-bar"></i> Estadísticas
            
              </button>
            </div>
        </div>

    <div class="table-responsive" ref="tableContainer" style="border-radius: 15px; max-height: 300px; overflow-y: auto; position: relative;">
        <table class="table table-striped table-hover table-bordered text-center">
            <thead class="thead-light" style="position: sticky; top: 0; z-index: 1; background-color: white;">
                <tr>
                    <th>Foto</th>
                    <th>Nombre Completo</th>
                    <th>Rut</th>
                    <th>Fecha Nacimiento</th>
                    <th>Fecha Ingreso</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="alumno in alumnos" :key="alumno.matricula">
                    <td class="align-middle">
                        <img class="img-fluid rounded-circle" src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="Avatar" style="width: 50px; height: 50px;" />
                    </td>
                    <td class="align-middle">{{ alumno.nombres }} {{ alumno.apellidoP }} {{ alumno.apellidoM }}</td>
                    <td class="align-middle">{{ alumno.rut }}</td>
                    <td class="align-middle">{{ alumno.fecNac }}</td>
                    <td class="align-middle">{{ alumno.fecIng }}</td>
                    <td class="align-middle">
                        <!-- Botón de vista de alumno -->
                        <button @click="goperfilalumno(alumno.matricula,alumno.nombres)" class="btn btn-sm btn-primary mx-1">
                            <i class="far fa-eye"></i>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>


    </div>
</div>
</template>

<script>
import axios from 'axios';
import navBar from '@/components/AppNavbarAdm.vue';
import autenticadorSesion from '../mixins/AutenticadorSesion.js';
import * as XLSX from 'xlsx';

export default {
    name: 'VistaAlumnos',
    mixins: [autenticadorSesion],
    props: ['nombreCurso, seccionCurso, codigo, periodo'],
    mounted() {
        console.log(this.$route.params.nombreCurso);
    },
    components: {
        navBar,

    },
    computed: {
        userRole() {
            const isAdmin = localStorage.getItem('isAdmin') || sessionStorage.getItem('isAdmin');
            return isAdmin === 'true' ? 'Administrador' : 'Docente';
        },
        // Computed property para verificar si el usuario es admin
        isAdmin() {
            return localStorage.getItem('isAdmin') === 'true' || sessionStorage.getItem('isAdmin') === 'true';
        },
        comentarioStats() {
            return {
                buenComportamiento: this.alumnos.reduce(
                    (count, alumno) => count + alumno.comentarios.filter(c => c.flag === 'buenComportamiento').length,
                    0
                ),
                advertencia: this.alumnos.reduce(
                    (count, alumno) => count + alumno.comentarios.filter(c => c.flag === 'advertencia').length,
                    0
                ),
                malComportamiento: this.alumnos.reduce(
                    (count, alumno) => count + alumno.comentarios.filter(c => c.flag === 'malComportamiento').length,
                    0
                ),
            };
        }
    },
    data() {
        return {
            nombreCurso: '',
            seccionCurso: '',
            alumnos: [],
            alumno: {
                nombres: '',
                apellidoP: '',
                apellidoM: '',
                rut: '',
                matricula: '',
                fecNac: '',
                fecIng: '',
            },
            newComment: {
                matricula: '',
                codDocente: '',
                comentario: '',
                peso: 0,
                flag: '',
            },
            formVisible: false,
            isEditMode: false,
            selectedFlag: null, // Controla la flag seleccionada
            formFields: {
                nombres: 'Nombres',
                apellidoP: 'Apellido Paterno',
                apellidoM: 'Apellido Materno',
                rut: 'Rut',
                matricula: 'Matricula',
                fecNac: 'Fecha Nacimiento',
                fecIng: 'Fecha Ingreso',
            },
            requiredFields: ['nombrePrimer', 'apellidoP', 'rut', 'matricula', 'fecNac', 'fecIng'],

        };

    },
    created() {
        this.nombreCurso = this.$route.params.nombreCurso || 'Sin nombre';
        this.seccionCurso = this.$route.params.seccionCurso || 'Sin sección';
        this.codigo = this.$route.params.codigo || 'Sin sección';
        this.periodo = this.$route.params.periodo || 'Sin sección';
        this.fetchAlumnos();
    },
    methods: {
        gotoEstadisticas() {
            this.$router.push({
                name: 'VistaEstadisticasGeneralDocente',
                params: {
                   
                    codCurso: this.codigo,
                    periodo: this.periodo
                }
            });
        },
        goperfilalumno(matricula, nombrePrimer) {
            console.log('Datos enviados:', matricula, nombrePrimer); // Debug para confirmar los valores
            this.$router.push({
                name: 'PerfilAlumno',
                params: {
                    matriculaalum: matricula,
                    nombrealum: nombrePrimer, codCurso: this.codigo, periodo: this.periodo 
                }
            });
        },
        async addComment() {
            try {
                this.newComment.matricula = this.alumno.matricula;
                this.newComment.codDocente = localStorage.getItem('rut') || sessionStorage.getItem('rut');

                await axios.post('http://localhost:3333/api/comments/add', this.newComment);
                this.newComment = {};
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        },
        goBack() {
            this.$router.push({
                name: 'VistaDocente'
            });
        },
        async fetchAlumnos() {
            console.log(this.codigo, this.periodo)
            try {
                const response = await axios.get(`http://localhost:3333/api/courseInstance/get/students/${this.codigo}/${this.periodo}`);
                if (response.data.status) {
                    this.alumnos = response.data.students;
                } else {
                    console.error(response.data.msg);
                }
            } catch (error) {
                console.error("Error al obtener alumnos:", error);
            }
        },
        toggleForm(mode, alumno = {}) {
            this.isEditMode = mode === 'edit';
            this.alumno = {
                ...alumno,
                valorAccion: '',
                comentario: ''
            };
            this.formVisible = true;
            this.selectedFlag = null;
        },
        handleSubmit() {
            console.log('Comentario agregado:', this.alumno);
            this.clearForm();
        },
        async addAlumno() {
            try {
                await axios.post('http://localhost:3333/api/student/register', this.alumno);
                this.fetchAlumnos();
            } catch (error) {
                console.error('Error al agregar alumno:', error);
            }
        },
        async updateAlumno() {
            try {
                await axios.put(`http://localhost:3333/api/student/${this.alumno.matricula}`, this.alumno);
                this.fetchAlumnos();
            } catch (error) {
                console.error('Error al actualizar alumno:', error);
            }
        },
        clearForm() {
            this.formVisible = false;
            this.selectedFlag = null;
        },

        triggerFileInput() {
            this.$refs.fileInput.click();
        },

        handleAddFile() {
            this.$refs.fileInput.click();
        },

        onFileSelected(event) {
            this.selectedFile = event.target.files[0];
            //this.uploadFile();
            this.uploadAlumnoFile(); // Llama a la nueva función para enviar el archivo a importCurso
        },

        async uploadAlumnoFile() {
            console.log('Subir archivo de curso');
            if (!this.selectedFile) {
                this.message = "Por favor, selecciona un archivo primero.";
                return;
            }

            const formData = new FormData();
            formData.append('file', this.selectedFile);

            try {
                const response = await axios.post('http://localhost:3333/csv/importEstudiante', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },

                });
                this.message = response.data.message;

                if (response.data.success) {
                    this.fetchAlumnos();
                } else {
                    console.error('Error en el archivo:', response.data.message);
                }

            } catch (error) {
                console.error('Error al subir el archivo de curso:', error);
            }
        },
        mounted() {
            const nombreCurso = this.$route.params.nombre;
            console.log(nombreCurso);
        },
        updateSelectedFlag(flag) {
            this.selectedFlag = flag;
            this.newComment.flag = flag;
        },
        async GenerateExcel() {
            const camposExcluidos = ['_id', 'lista_de_acciones', '__v'];
            const filteredData = this.alumnos.map(obj =>
                Object.fromEntries(Object.entries(obj).filter(([key]) => !camposExcluidos.includes(key)))
            );
            const ws = XLSX.utils.json_to_sheet(filteredData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Alumnos');

            const nombrearchivo = 'ALUMNOS DE ' + this.nombreCurso + '.xlsx';
            XLSX.writeFile(wb, nombrearchivo);
        },
    }
};
</script>

<style scoped>
.maincontent {
    background-color: var(--background);
    min-height: calc(100vh - 80px);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    overflow-x: hidden;
}

.gestor-docentes-container {
    max-width: 1200px;
    width: 100%;
    margin: auto;
    background-color: #fff;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.header-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 60px;
    position: relative;
}

.back-button {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    padding: 10px 20px;
    margin-right: 20px;
    background-color: #f8f9fa;
    border: 1px solid #ced4da;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
    color: #333;
}

.back-button:hover {
    background-color: #e2e6ea;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    color: #333;
}

.title {
    font-size: 2rem;
    font-weight: bold;
    color: #2c3e50;
    padding: 15px;
    border: 2px solid #eaeaea;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0;
}

.section-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.section-title h3 {
    font-size: 1.5rem;
    color: #2c3e50;
    margin: 0;
    padding: 10px;
    border-bottom: 3px solid #3498db;
    background-color: #ffffff;
    display: inline-block;
    border-radius: 4px;
}

.section-title h3 {
    font-size: 1.5rem;
    color: #2c3e50;
    margin: 0;
}

.action-buttons {
    display: flex;
    gap: 10px;
}

.table-container {
    overflow-x: auto;
    border-radius: 10px;
}

.table {
    border-radius: 10px;
    overflow: hidden;
}

.table td,
.table th {
    vertical-align: middle;
    padding: 10px;
}

.img-fluid.rounded-circle {
    width: 50px;
    height: 50px;
    object-fit: cover;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-content {
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    max-width: 600px;
    width: 100%;
}

body {
    background-size: cover;
    background-attachment: fixed;
}

html,
body {
    height: 100%;
    margin: 0;
    padding: 0;
}
</style>
