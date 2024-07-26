"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const registros_controller_1 = __importDefault(require("../controllers/registros.controller"));
class RegistroRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        // GET
        this.router.get('/:fkVoluntariado/', auth_middleware_1.verifyToken, registros_controller_1.default.obtenerVoluntariosRegistrados);
        this.router.get('/:fkVoluntariado/:fkVoluntario', auth_middleware_1.verifyToken, registros_controller_1.default.validarVoluntarioRegistrado);
        // POST
        this.router.post('/registrar', auth_middleware_1.verifyToken, registros_controller_1.default.registrarVoluntario);
        this.router.post('/darDeBaja', auth_middleware_1.verifyToken, registros_controller_1.default.darDeBajaVoluntario);
    }
}
const registroRoutes = new RegistroRoutes();
exports.default = registroRoutes.router;
