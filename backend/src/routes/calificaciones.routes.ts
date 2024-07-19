import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import calificacionController from "../controllers/calificaciones.controller";


class CalificacionRoutes{
    
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        // GET
        this.router.get('/:fkVoluntariado/:fkVoluntario',verifyToken, calificacionController.obtenerCalificaciones);
        this.router.get('/promedio/:fkVoluntariado',verifyToken, calificacionController.obtenerPromedio);

        // POST
        this.router.post('/',verifyToken, calificacionController.registrarCalificacion);
    }
}

const calificacionRoutes = new CalificacionRoutes();
export default calificacionRoutes.router;