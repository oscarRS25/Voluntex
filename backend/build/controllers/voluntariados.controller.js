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
exports.voluntariadoController = void 0;
const connection_1 = __importDefault(require("../connection"));
class VoluntariadoController {
    // GET
    obtenerVoluntariados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const voluntariados = yield connection_1.default.query('SELECT v.*, e.nomEmpresa, e.email, e.telefono FROM voluntariados as v INNER JOIN usuarios as e on v.fkEmpresa = e.id;');
            res.json(voluntariados);
        });
    }
    obtenerPorEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fkEmpresa } = req.params;
            const voluntariados = yield connection_1.default.query('SELECT * FROM voluntariados WHERE fkEmpresa = ?', [fkEmpresa]);
            res.json(voluntariados);
        });
    }
    obtenerPorVoluntario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const voluntariados = yield connection_1.default.query('SELECT v.*, e.nomEmpresa, e.email, e.telefono  FROM voluntariados as v INNER JOIN registros as r ON v.id = r.fkVoluntariado INNER JOIN usuarios as u ON r.fkVoluntario = u.id INNER JOIN usuarios as e ON v.fkEmpresa = e.id WHERE u.id = ?', [id]);
            res.json(voluntariados);
        });
    }
    verVoluntariado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const voluntariado = yield connection_1.default.query('SELECT v.*, u.nomEmpresa, u.email, u.telefono FROM voluntariados as v INNER JOIN usuarios as u on v.fkEmpresa = u.id WHERE v.id = ?;', [id]);
            res.json(voluntariado[0]);
        });
    }
    registrarVoluntariado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield connection_1.default.query('INSERT INTO voluntariados SET ?', [req.body]);
                res.status(200).json({ message: 'Se registró el voluntariado correctamente', insertedId: result.insertId });
            }
            catch (error) {
                console.error('Error al registrar el voluntariado:', error);
                res.status(500).json({ message: 'Error al registrar el voluntariado' });
            }
        });
    }
    modificarVoluntariado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield connection_1.default.query('UPDATE voluntariados SET ? WHERE id = ?', [req.body, id]);
                res.json({ message: 'El voluntariado ha sido actualizado' });
            }
            catch (error) {
                console.error('Error al modificar el voluntariado:', error);
                res.status(500).json({ message: 'Error al modificar el voluntariado' });
            }
        });
    }
    terminarVoluntariado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                // Obtener la fecha actual y formatearla a YYYY-MM-DD
                const fecha = new Date();
                const fechaCierre = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
                // Actualizar estatus a 1 y asignar la fecha actual a fechaCierre
                yield connection_1.default.query('UPDATE voluntariados SET estatus = 1, fechaCierre = ? WHERE id = ?', [fechaCierre, id]);
                res.json({ message: 'El voluntariado ha sido culminado' });
            }
            catch (error) {
                console.error('Error al culminar el voluntariado:', error);
                res.status(500).json({ message: 'Error al culminar el voluntariado' });
            }
        });
    }
    eliminarVoluntariado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                // Consultar el valor de ingresos
                const [result] = yield connection_1.default.query('SELECT ingresos FROM voluntariados WHERE id = ?', [id]);
                if (result.length === 0) {
                    res.status(404).json({ message: 'Voluntariado no encontrado' });
                    return;
                }
                if (result.ingresos != 0) {
                    res.status(400).json({ message: 'No se puede eliminar el voluntariado porque ya tiene voluntarios registrados' });
                    return;
                }
                // Eliminar el voluntariado si ingresos es 0
                yield connection_1.default.query('DELETE FROM voluntariados WHERE id = ?', [id]);
                res.json({ message: 'El voluntariado ha sido eliminado' });
            }
            catch (error) {
                console.error('Error al eliminar el voluntariado:', error);
                res.status(500).json({ message: 'Error al eliminar el voluntariado' });
            }
        });
    }
}
exports.voluntariadoController = new VoluntariadoController();
exports.default = exports.voluntariadoController;
