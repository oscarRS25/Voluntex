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
exports.registroController = void 0;
const connection_1 = __importDefault(require("../connection"));
class RegistroController {
    obtenerVoluntariosRegistrados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fkVoluntariado } = req.params;
            const registrados = yield connection_1.default.query('SELECT r.fechaReg, u.nombre, u.apePat, u.apeMat, u.email, u.telefono FROM registros as r INNER JOIN usuarios as u ON r.fkVoluntario = u.id WHERE r.fkVoluntariado = ?;', fkVoluntariado);
            res.json(registrados);
        });
    }
    validarVoluntarioRegistrado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fkVoluntariado, fkVoluntario } = req.params;
                // Validar los parámetros
                if (!fkVoluntariado || !fkVoluntario) {
                    res.status(400).json({ error: 'Parámetros faltantes' });
                    return;
                }
                // Ejecutar la consulta
                const [result] = yield connection_1.default.query('SELECT * FROM registros WHERE fkVoluntariado = ? AND fkVoluntario = ?', [fkVoluntariado, fkVoluntario]);
                // Verificar si el registro existe
                if (result) {
                    res.json({ registrado: true });
                }
                else {
                    res.json({ registrado: false });
                }
            }
            catch (error) {
                console.error('Error al validar el voluntario:', error);
                res.status(500).json({ error: 'Error interno del servidor' });
            }
        });
    }
    registrarVoluntario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fkVoluntariado } = req.body;
            try {
                // Verificar vacantes disponibles
                const voluntariado = yield connection_1.default.query('SELECT cupo, ingresos FROM voluntariados WHERE id = ?', [fkVoluntariado]);
                if (voluntariado.length === 0) {
                    res.status(404).json({ message: 'Voluntariado no encontrado' });
                    return;
                }
                const { cupo, ingresos } = voluntariado[0];
                if (ingresos >= cupo) {
                    res.status(400).json({ message: 'No hay vacantes disponibles' });
                    return;
                }
                // Registrar al voluntario
                const result = yield connection_1.default.query('INSERT INTO registros SET ?', [req.body]);
                // Actualizar ingresos en voluntariados
                yield connection_1.default.query('UPDATE voluntariados SET ingresos = ingresos + 1 WHERE id = ?', [fkVoluntariado]);
                res.status(200).json({ message: 'Se registró el voluntario correctamente', insertedId: result.insertId });
            }
            catch (error) {
                console.error('Error al registrar el voluntario:', error);
                res.status(500).json({ message: 'Error al registrar el voluntario' });
            }
        });
    }
    darDeBajaVoluntario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fkVoluntariado, fkVoluntario } = req.body;
            try {
                // Verificar existencia del registro
                const registro = yield connection_1.default.query('SELECT id FROM registros WHERE fkVoluntariado = ? AND fkVoluntario = ?', [fkVoluntariado, fkVoluntario]);
                if (registro.length === 0) {
                    res.status(404).json({ message: 'Registro no encontrado' });
                    return;
                }
                const registroId = registro[0].id;
                // Eliminar el registro
                yield connection_1.default.query('DELETE FROM registros WHERE id = ?', [registroId]);
                // Actualizar ingresos en voluntariados
                yield connection_1.default.query('UPDATE voluntariados SET ingresos = ingresos - 1 WHERE id = ?', [fkVoluntariado]);
                res.status(200).json({ message: 'El voluntario ha sido dado de baja correctamente' });
            }
            catch (error) {
                console.error('Error al dar de baja al voluntario:', error);
                res.status(500).json({ message: 'Error al dar de baja al voluntario' });
            }
        });
    }
}
exports.registroController = new RegistroController();
exports.default = exports.registroController;
