"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_controller_1 = __importDefault(require("../controllers/usuario.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
class UsuarioRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', auth_middleware_1.verifyToken, usuario_controller_1.default.obtenerUsuarios);
        this.router.get('/:id', auth_middleware_1.verifyToken, usuario_controller_1.default.verUsuario);
        this.router.get('/credenciales/:id', auth_middleware_1.verifyToken, usuario_controller_1.default.obtenerCredenciales);
        this.router.get('/getByEmail/:email', usuario_controller_1.default.obtenerUsuarioEmail);
        this.router.post('/', usuario_controller_1.default.registrarUsuario);
        this.router.put('/:id', usuario_controller_1.default.modificarUsuario);
        this.router.delete('/:id', auth_middleware_1.verifyToken, usuario_controller_1.default.eliminarUsuario);
        this.router.get('/password/:email', usuario_controller_1.default.enviarEmailConfirmacion);
        this.router.put('/password/:id/:email', usuario_controller_1.default.cambiarContrasena);
        this.router.post('/validarEmailTel/', usuario_controller_1.default.validarTelefonoEmail);
        // Con token v1 pa registro y cambio de suscripción
        this.router.post('/inicio_sesion', usuario_controller_1.default.inicio_sesion);
        // Con tokeken v2 pa login normal
        this.router.post('/login', usuario_controller_1.default.login);
        this.router.post("/verify-otp", usuario_controller_1.default.verifyOtp);
    }
}
const usuarioRoutes = new UsuarioRoutes();
exports.default = usuarioRoutes.router;
