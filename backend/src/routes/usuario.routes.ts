import { Router } from "express";

import usuarioController from "../controllers/usuario.controller";
import { verifyToken } from "../middlewares/auth.middleware";

class UsuarioRoutes{
    
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/',verifyToken, usuarioController.obtenerUsuarios);
        this.router.get('/:id',verifyToken, usuarioController.verUsuario);
        this.router.get('/credenciales/:id',verifyToken, usuarioController.obtenerCredenciales);
        this.router.get('/getByEmail/:email',usuarioController.obtenerUsuarioEmail);
        this.router.post('/',usuarioController.registrarUsuario);
        this.router.put('/:id', usuarioController.modificarUsuario);
        this.router.delete('/:id',verifyToken, usuarioController.eliminarUsuario);
        this.router.get('/password/:email',usuarioController.enviarEmailConfirmacion);
        this.router.put('/password/:id/:email',usuarioController.cambiarContrasena);
        
        this.router.post('/validarEmailTel/',usuarioController.validarTelefonoEmail);

        // Con token v1 pa registro y cambio de suscripción
        this.router.post('/inicio_sesion',usuarioController.inicio_sesion);

        // Con tokeken v2 pa login normal
        this.router.post('/login',usuarioController.login);
        this.router.post("/verify-otp", usuarioController.verifyOtp);
    }
}

const usuarioRoutes = new UsuarioRoutes();
export default usuarioRoutes.router;