var teachingModel = require('./teachingModel.js');
var userModel = require('../user/userModel.js');


module.exports.registerTeachingDBService = (teachingData) => {
    return new Promise(async function myFn(resolve, reject) {
        try {
            // Verificar si el docente ya existe por su 'rut'
            const existingTeaching = await teachingModel.findOne({ rut: teachingData.rut });
            if (existingTeaching) {
                resolve('duplicate'); // Indica duplicado
                return;
            }

            // Verificar si ya existe un usuario con el mismo 'rut' (si aplica)
            const existingUser = await userModel.findOne({ rut: teachingData.rut });
            if (existingUser) {
                resolve('duplicate'); // Indica duplicado
                return;
            }

            // Crear un nuevo docente
            var teachingModelData = new teachingModel();
            const newUser = new userModel();

            teachingModelData.nombres = teachingData.nombres;
            teachingModelData.apellidoP = teachingData.apellidoP;
            teachingModelData.apellidoM = teachingData.apellidoM;
            teachingModelData.rut = teachingData.rut;
            teachingModelData.titulo = teachingData.titulo;
            teachingModelData.gradoMax = teachingData.gradoMax;

            // Crear usuario relacionado
            newUser.email = `${teachingData.nombres[0]}${teachingData.nombres[1]}${teachingData.apellidoP}@email.com`.toLowerCase();
            newUser.password = "1234";  
            newUser.isAdmin = false; 
            newUser.username = `${teachingData.nombres}${teachingData.apellidoP}`.toLowerCase();
            newUser.rut = teachingData.rut;

            await teachingModelData.save();
            await newUser.save();

            console.log("New user created:", newUser);
            resolve(true); // Registro exitoso
        } catch (error) {
            reject(error); // Error general
        }
    });
};




module.exports.searchTeachingDBService = async (teachingData) => {
    try {
        const result = await teachingModel.findOne({ email: teachingData.email });

        if (result) {
            console.log("Docente encontrado");
            return { status: true, msg: "Docente encontrado", user: result  };
        } else {
            console.log("INVALID DATA");
            return { status: false, msg: "INVALID DATA" };
        }

    } catch (error) {
        console.log("INVALID DATA");
        return { status: false, msg: "INVALID DATA" };
    }
};

module.exports.getTeachingsDBService = async () => {
    try {
        const result = await teachingModel.find();


        if (result.length > 0) {
            console.log("Docentes encontrados");
            return { status: true, msg: "Docentes encontrados", teachings: result };
        } else {
            console.log("No se encontraron Docentes");
            return { status: false, msg: "No se encontraron Docentes" };
        }

    } catch (error) {
        console.log("Error al obtener Docentes:", error);
        return { status: false, msg: "Error al obtener Docentes" };
    }
};

module.exports.editTeachingDBService = async (rut, updatedData) => {
    try {
        const teaching = await teachingModel.findOne({ rut });

        if (teaching) {
            Object.assign(teaching, updatedData); // Usamos Object.assign para actualizar los campos
            await teaching.save();

            console.log("Docente actualizado:", teaching);
            return { status: true, msg: "Docente actualizado correctamente", teaching };
        } else {
            console.log("Docente no encontrado");
            return { status: false, msg: "Docente no encontrado" };
        }
    } catch (error) {
        console.log("Error al actualizar el Docente:", error);
        return { status: false, msg: "Error al actualizar el Docente" };
    }
};

module.exports.removeTeachingDBService = async (rut) => {
    try {
        const teaching = await teachingModel.findOne({ rut });

        if (teaching) {
            await teachingModel.deleteOne({ rut });

            console.log("Docente eliminado:", teaching);
            return { status: true, msg: "Docente eliminado correctamente", teaching };
        } else {
            console.log("Docente no encontrado");
            return { status: false, msg: "Docente no encontrado" };
        }
    } catch (error) {
        console.log("Error al eliminar el Docente:", error);
        return { status: false, msg: "Error al eliminar el Docente" };
    }
};


