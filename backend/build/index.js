"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const voluntariados_routes_1 = __importDefault(require("./routes/voluntariados.routes"));
const calificaciones_routes_1 = __importDefault(require("./routes/calificaciones.routes"));
const usuarios_routes_1 = __importDefault(require("./routes/usuarios.routes"));
const registros_routes_1 = __importDefault(require("./routes/registros.routes"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
    }
    config() {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        this.app.use('/api/usuarios', usuarios_routes_1.default);
        this.app.use('/api/voluntariados', voluntariados_routes_1.default);
        this.app.use('/api/calificaciones', calificaciones_routes_1.default);
        this.app.use('/api/registros', registros_routes_1.default);
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
