import { Router } from "express";
import { voluntariadoController } from "../controllers/voluntariados.controller";
import { verifyToken } from "../middlewares/auth.middleware";


class VolutariadoRoutes{
    
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        // GET
        this.router.get('/',verifyToken, voluntariadoController.obtenerVoluntariados);
        this.router.get('/empresa/:fkEmpresa',verifyToken, voluntariadoController.obtenerPorEmpresa);
        this.router.get('/voluntario/:id',verifyToken, voluntariadoController.obtenerPorVoluntario);
        this.router.get('/ver/:id',verifyToken, voluntariadoController.verVoluntariado);

        // POST
        this.router.post('/',verifyToken, voluntariadoController.registrarVoluntariado);

        // PUT
        this.router.put('/:id',verifyToken, voluntariadoController.modificarVoluntariado);
        this.router.put('/terminar/:id',verifyToken, voluntariadoController.terminarVoluntariado);

        // DELETE
        this.router.delete('/:id',verifyToken, voluntariadoController.eliminarVoluntariado);
    }
}

const voluntariadoRoutes = new VolutariadoRoutes();
export default voluntariadoRoutes.router;