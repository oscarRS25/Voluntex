"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const calificaciones_controller_1 = __importDefault(require("../controllers/calificaciones.controller"));
class CalificacionRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        // GET
        this.router.get('/promedio/:fkVoluntariado', auth_middleware_1.verifyToken, calificaciones_controller_1.default.obtenerPromedio);
        this.router.get('/todas/:fkVoluntariado/:fkVoluntario', auth_middleware_1.verifyToken, calificaciones_controller_1.default.obtenerCalificaciones);
        this.router.get('/obtener/mia/:fkVoluntariado/:fkVoluntario', auth_middleware_1.verifyToken, calificaciones_controller_1.default.obtenerMiCalificacion);
        // POST
        this.router.post('/', auth_middleware_1.verifyToken, calificaciones_controller_1.default.registrarCalificacion);
    }
}
const calificacionRoutes = new CalificacionRoutes();
exports.default = calificacionRoutes.router;
