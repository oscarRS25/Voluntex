import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import voluntariadosRoutes from './routes/voluntariados.routes';
import calificacionesRoutes from './routes/calificaciones.routes';
import usuariosRoutes from './routes/usuarios.routes';
import registrosRoutes from './routes/registros.routes';

class Server {

    public app: Application;
    
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    config(): void {
        this.app.set('port', process.env.PORT || 3000);

        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
    }

    routes(): void {
        this.app.use('/api/usuarios', usuariosRoutes);
        this.app.use('/api/voluntariados', voluntariadosRoutes);
        this.app.use('/api/calificaciones', calificacionesRoutes);
        this.app.use('/api/registros', registrosRoutes);
    }

    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }

}

const server = new Server();
server.start();

//hrwp tjwr emfp hwqz
