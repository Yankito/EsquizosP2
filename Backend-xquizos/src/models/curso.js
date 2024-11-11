var mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Esquema de datos para almacenar información personal.
 * @typedef {Object} Datos
 * @property {String} nombre - Nombre de la persona.
 * @property {String} apellido - Apellido de la persona.
 * @property {String} pais - País de residencia.
 * @property {String} ciudad - Ciudad de residencia.
 * @property {String} fecha_nacimiento - Fecha de nacimiento.
 * @property {String} estatura - Estatura de la persona.
 */
const cursoSchema  = new Schema({
    ID: {
        type: String,
        unique: true
    },
    curso: String,
    nombreAlumno: String,
    apellidoAlumno: String,
});

module.exports = new mongoose.model('curso', cursoSchema);