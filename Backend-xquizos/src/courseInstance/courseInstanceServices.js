var courseInstanceModel = require('./courseInstanceModel.js');
var teachingModel = require('../teaching/teachingModel.js');
var courseModel = require('../course/courseModel.js');
var studentModel = require('../student/studentModel.js');


module.exports.registerCourseInstanceDBService = (courseData) => {
    return new Promise(async function myFn(resolve, reject) {

        var courseInstanceModelData = new courseInstanceModel();

        courseInstanceModelData.codCurso = courseData.codCurso.toUpperCase();
        courseInstanceModelData.codDocente = "XD";

        try {
            await courseInstanceModelData.save();
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};


module.exports.getCourseInstanceDBService = async (curso) => {
    try {
        console.log(curso.codCurso);
        const result = await courseInstanceModel.findOne({ codCurso: curso.codCurso });
        console.log(result);
        if (result) {
            console.log("Curso encontrado");
            return { status: true, msg: "Curso encontrado", courseInstance: result  };
        } else {
            console.log("INVALID DATA");
            return { status: false, msg: "INVALID DATA" };
        }

    } catch (error) {
        console.log("INVALID DATA");
        return { status: false, msg: "INVALID DATA" };
    }
};

module.exports.getAllCoursesInstanceDBService = async () => {
    try {
        const result = await courseInstanceModel.aggregate([
            {
                $lookup: {
                    from: 'Course', // Nombre de la colección de Course
                    localField: 'codCurso', // Campo en CourseInstance
                    foreignField: 'codigo', // Campo en Course
                    as: 'course'
                }
            },
            {
                $unwind: {
                    path: '$courseDetails',
                    preserveNullAndEmptyArrays: true // Maneja instancias sin curso relacionado
                }
            }
        ]);

        if (result) {
            console.log("Instancias de cursos encontradas");
            return { status: true, msg: "Instancias de cursos encontradas", courseInstances: result };
        } else {
            console.log("INVALID DATA");
            return { status: false, msg: "INVALID DATA" };
        }
    } catch (error) {
        console.log("Error:", error.message);
        return { status: false, msg: "Error al obtener instancias de cursos" };
    }
};


module.exports.getTeacherCourseInstancesDBService = async (codDocente) => {
    try {
        console.log(codDocente);
        const result = await courseInstanceModel.find({ codDocente: codDocente });
        result.codCurso;

        const cursos = await studentModel.find({ codDocente: codDocente });
        console.log(result);
        if (result) {
            console.log("Curso encontrado");
            return { status: true, msg: "Curso encontrado", courseInstance: result  };
        } else {
            console.log("INVALID DATA");
            return { status: false, msg: "INVALID DATA" };
        }

    } catch (error) {
        console.log("INVALID DATA");
        return { status: false, msg: "INVALID DATA" };
    }
};

module.exports.getStudentsFromCourseInstanceDBService = async (curso) => {
    try {
        console.log("Código del curso:", curso);

        const result = await this.getCourseInstanceDBService(curso);
        if (!result) {
            console.log("No se encontró la instancia del curso.");
            return { status: false, msg: "Curso no encontrado" };
        }

        console.log("Instancia del curso encontrada:", result.courseInstance);

        if (!result.courseInstance.alumnos || result.courseInstance.alumnos.length === 0) {
            console.log("No hay alumnos registrados en el curso.");
            return { status: false, msg: "No hay alumnos registrados en el curso" };
        }

        const matriculas = result.courseInstance.alumnos.map((alumno) => alumno.matricula);
        console.log("Matrículas de alumnos:", matriculas);

        const students = await studentModel.find({ matricula: { $in: matriculas } });
        console.log("Datos de los estudiantes encontrados:", students);

        if (students.length > 0) {
            return { status: true, msg: "Estudiantes encontrados", students: students };
        } else {
            console.log("No se encontraron estudiantes con las matrículas proporcionadas.");
            return { status: false, msg: "No se encontraron estudiantes con las matrículas proporcionadas" };
        }
    } catch (error) {
        console.error("Error al obtener los estudiantes:", error);
        return { status: false, msg: "Error al obtener los estudiantes", error: error.message };
    }
};


module.exports.getTeachingFromCourseInstanceDBService = async (curso) => {
    try {
        console.log(curso);
        const result = await this.getCourseInstanceDBService(curso);
        
        console.log("Instancia de curso: ",result.courseInstance);
        console.log("Codigo del docente: ",result.courseInstance.codDocente);
        const teaching = await teachingModel.findOne({ rut: result.courseInstance.codDocente });
        console.log(teaching);
        if (teaching) {
            console.log("Profesor encontrado");
            return { status: true, msg: "Profesor encontrado", teaching: teaching  };
        } else {
            console.log("INVALID DATA");
            return { status: false, msg: "INVALID DATA" };
        }

    } catch (error) {
        console.log("INVALID DATA");
        return { status: false, msg: "INVALID DATA" };
    }
};



module.exports.updateCodDocenteInCourseInstance = async (curso, newCodDocente) => {
    try {
        // Busca la instancia del curso por su código
        console.log(curso);
        console.log(newCodDocente);
        const result = await this.getCourseInstanceDBService(curso);
        console.log(result.courseInstance);

        if (result) {
            result.courseInstance.codDocente = newCodDocente.codDocente; 
            await result.courseInstance.save();

            console.log("codDocente actualizado:", result.courseInstance.codDocente);
            return { status: true, msg: "codDocente actualizado correctamente", codDocente : result.courseInstance.codDocente };
        } else {
            console.log("Curso no encontrado");
            return { status: false, msg: "Curso no encontrado" };
        }
    } catch (error) {
        console.log("Error al actualizar codDocente:", error);
        return { status: false, msg: "Error al actualizar codDocente" };
    }
};

module.exports.addStudentToCourseInstanceDBService = async (curso, alumno) => {
    try {
        // Busca la instancia del curso por su código
        console.log("Curso:", curso);
        const newAlumno = alumno.alumno;
        console.log("Nuevo alumno:", newAlumno);
        const response = await studentModel.findOne({matricula: newAlumno});
        if(!response){
            return {
                status: false,
                msg: "El alumno NO EXISTE",
            };
        }

        const result = await this.getCourseInstanceDBService(curso);

        if (result && result.courseInstance) {
            const courseInstance = result.courseInstance;

            // Verifica si ya existe un alumno con la misma matrícula
            const isAlumnoExist = courseInstance.alumnos.some(
                (a) => a.matricula === newAlumno
            );

            if (isAlumnoExist) {
                return {
                    status: false,
                    msg: "El alumno ya está matriculado en el curso",
                };
            }

            // Agrega el nuevo alumno al arreglo, asegurándose de pasar un objeto con los campos correctos
            courseInstance.alumnos.push({
                matricula: newAlumno,
            });

            await courseInstance.save();

            console.log("Alumno agregado:", newAlumno);
            return {
                status: true,
                msg: "Alumno agregado correctamente",
                alumnos: courseInstance.alumnos,
            };
        } else {
            console.log("Curso no encontrado");
            return { status: false, msg: "Curso no encontrado" };
        }
    } catch (error) {
        console.log("Error al agregar alumno:", error);
        return { status: false, msg: "Error al agregar alumno" };
    }
};





module.exports.removeCourseInstanceDBService = async (codCurso) => {
    try {
        const course = await courseInstanceModel.findOne({ codCurso: codCurso });

        if (course) {
            await courseInstanceModel.deleteOne({ codCurso: codCurso });

            console.log("Curso eliminado:", course);
            return { status: true, msg: "Curso eliminado correctamente", course };
        } else {
            console.log("Curso no encontrado");
            return { status: false, msg: "Curso no encontrado" };
        }
    } catch (error) {
        console.log("Error al eliminar el Curso:", error);
        return { status: false, msg: "Error al eliminar el Curso" };
    }
};



