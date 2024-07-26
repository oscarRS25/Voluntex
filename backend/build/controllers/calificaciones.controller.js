"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calificacionController = void 0;
const connection_1 = __importDefault(require("../connection"));
class CalificacionController {
    // GET
    obtenerCalificaciones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fkVoluntariado, fkVoluntario } = req.params;
            const calificaciones = yield connection_1.default.query('SELECT c.*, u.nombre, u.apePat, u.apeMat FROM calificaciones AS c INNER JOIN usuarios AS u ON c.fkVoluntario = u.id WHERE fkVoluntariado = ? AND c.fkVoluntario != ? ORDER BY c.fecha DESC;', [fkVoluntariado, fkVoluntario]);
            res.json(calificaciones);
        });
    }
    obtenerMiCalificacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fkVoluntariado, fkVoluntario } = req.params;
            const calificacion = yield connection_1.default.query('Select c.*, u.nombre, u.apePat, u.apeMat from calificaciones as c INNER JOIN usuarios as u ON c.fkVoluntario = u.id WHERE c.fkVoluntariado = ? AND c.fkVoluntario = ?', [fkVoluntariado, fkVoluntario]);
            res.json(calificacion[0]);
        });
    }
    obtenerPromedio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fkVoluntariado } = req.params;
                const result = yield connection_1.default.query('SELECT ROUND(AVG(calificacion), 0) AS promedio FROM calificaciones WHERE fkVoluntariado = ?', [fkVoluntariado]);
                // Accede al valor del promedio
                const promedio = result[0].promedio;
                // Enviar solo el valor del promedio
                res.json({ promedio });
            }
            catch (error) {
                console.error('Error al obtener el promedio:', error);
                res.status(500).json({ message: 'Error al obtener el promedio' });
            }
        });
    }
    registrarCalificacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield connection_1.default.query('INSERT INTO calificaciones SET ?', [req.body]);
                res.status(200).json({ message: 'Se registró la calificacion correctamente', insertedId: result.insertId });
            }
            catch (error) {
                console.error('Error al registrar la calificacion:', error);
                res.status(500).json({ message: 'Error al registrar la calificacion' });
            }
        });
    }
}
exports.calificacionController = new CalificacionController();
exports.default = exports.calificacionController;
