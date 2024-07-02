import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import usuarioRoutes from './routes/usuario.routes';
import empresaRoutes from './routes/empresa.routes';

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
        this.app.use('/api/usuarios', usuarioRoutes);
        this.app.use('/api/empresa', empresaRoutes);
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
