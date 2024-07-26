import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import registroController from "../controllers/registros.controller";

class RegistroRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        // GET
        this.router.get('/:fkVoluntariado/', verifyToken, registroController.obtenerVoluntariosRegistrados);
        this.router.get('/:fkVoluntariado/:fkVoluntario',verifyToken, registroController.validarVoluntarioRegistrado);

        // POST
        this.router.post('/registrar', verifyToken, registroController.registrarVoluntario);
        this.router.post('/darDeBaja', verifyToken, registroController.darDeBajaVoluntario);
    }
}

const registroRoutes = new RegistroRoutes();
export default registroRoutes.router;
