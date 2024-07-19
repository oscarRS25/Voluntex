"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const voluntariados_controller_1 = require("../controllers/voluntariados.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
class VolutariadoRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        // GET
        this.router.get('/', auth_middleware_1.verifyToken, voluntariados_controller_1.voluntariadoController.obtenerVoluntariados);
        this.router.get('/empresa/:fkEmpresa', auth_middleware_1.verifyToken, voluntariados_controller_1.voluntariadoController.obtenerPorEmpresa);
        this.router.get('/voluntario/:id', auth_middleware_1.verifyToken, voluntariados_controller_1.voluntariadoController.obtenerPorVoluntario);
        this.router.get('/ver/:id', auth_middleware_1.verifyToken, voluntariados_controller_1.voluntariadoController.verVoluntariado);
        // POST
        this.router.post('/', auth_middleware_1.verifyToken, voluntariados_controller_1.voluntariadoController.registrarVoluntariado);
        // PUT
        this.router.put('/:id', auth_middleware_1.verifyToken, voluntariados_controller_1.voluntariadoController.modificarVoluntariado);
        this.router.put('/terminar/:id', auth_middleware_1.verifyToken, voluntariados_controller_1.voluntariadoController.terminarVoluntariado);
        // DELETE
        this.router.delete('/:id', auth_middleware_1.verifyToken, voluntariados_controller_1.voluntariadoController.eliminarVoluntariado);
    }
}
const voluntariadoRoutes = new VolutariadoRoutes();
exports.default = voluntariadoRoutes.router;
