"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class UserRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        /* --- Cambiar por rutas propias ---
        this.router.get('/:id_proyecto', usuarioController.obtenerNotas);
        this.router.post('/', usuarioController.registrarNota);
        this.router.put('/:id_nota', usuarioController.modificarNota);
        this.router.delete('/:id_nota', usuarioController.eliminarNota);
        */
    }
}
const userRoutes = new UserRoutes();
exports.default = userRoutes.router;
