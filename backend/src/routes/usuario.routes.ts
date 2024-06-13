import { Router } from "express";

import usuarioController from "../controllers/usuario.controller";

class UserRoutes{
    
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        /* --- Cambiar por rutas propias ---
        this.router.get('/:id_proyecto', usuarioController.obtenerNotas);
        this.router.post('/', usuarioController.registrarNota);
        this.router.put('/:id_nota', usuarioController.modificarNota);
        this.router.delete('/:id_nota', usuarioController.eliminarNota);
        */
    }
}

const userRoutes = new UserRoutes();
export default userRoutes.router;