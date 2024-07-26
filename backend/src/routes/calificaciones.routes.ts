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
        this.router.get('/promedio/:fkVoluntariado',verifyToken, calificacionController.obtenerPromedio);
        this.router.get('/todas/:fkVoluntariado/:fkVoluntario',verifyToken, calificacionController.obtenerCalificaciones);
        this.router.get('/obtener/mia/:fkVoluntariado/:fkVoluntario',verifyToken, calificacionController.obtenerMiCalificacion)

        // POST
        this.router.post('/',verifyToken, calificacionController.registrarCalificacion);
    }
}

const calificacionRoutes = new CalificacionRoutes();
export default calificacionRoutes.router;