"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarios_controller_1 = __importDefault(require("../controllers/usuarios.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
class UsuarioRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', auth_middleware_1.verifyToken, usuarios_controller_1.default.obtenerUsuarios);
        this.router.get('/:id', auth_middleware_1.verifyToken, usuarios_controller_1.default.verUsuario);
        this.router.get('/getByEmail/:email', usuarios_controller_1.default.obtenerUsuarioEmail);
        this.router.post('/', usuarios_controller_1.default.registrarUsuario);
        this.router.put('/:id', usuarios_controller_1.default.modificarUsuario);
        this.router.delete('/:id', auth_middleware_1.verifyToken, usuarios_controller_1.default.eliminarUsuario);
        this.router.get('/password/:email', usuarios_controller_1.default.enviarEmailConfirmacion);
        this.router.post('/validarEmailTel/', usuarios_controller_1.default.validarTelefonoEmail);
        // Con token v1 pa registro y cambio de suscripción
        this.router.post('/inicio_sesion', usuarios_controller_1.default.inicio_sesion);
        // Con tokeken v2 pa login normal
        this.router.post('/login', usuarios_controller_1.default.login);
        this.router.post("/verify-otp", usuarios_controller_1.default.verifyOtp);
    }
}
const usuarioRoutes = new UsuarioRoutes();
exports.default = usuarioRoutes.router;
