"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuarioController = void 0;
const connection_1 = __importDefault(require("../connection"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const nodemailer = require("nodemailer");
class UsuarioController {
    constructor() {
        this.otps = {};
        this.login = this.login.bind(this);
        this.generateOtp = this.generateOtp.bind(this);
        this.verifyOtp = this.verifyOtp.bind(this);
    }
    obtenerUsuarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuarios = yield connection_1.default.query("SELECT * from usuarios");
            if (usuarios.length > 0) {
                return res.json(usuarios);
            }
        });
    }
    verUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const usuario = yield connection_1.default.query("SELECT * FROM usuarios WHERE id = ?", [id]);
            if (usuario.length > 0) {
                return res.json(usuario[0]);
            }
            res.status(404).json({ text: "El usuario no existe" });
        });
    }
    obtenerUsuarioEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.params;
            const usuario = yield connection_1.default.query("SELECT id, email FROM usuarios WHERE email = ?", [email]);
            if (usuario.length > 0) {
                return res.json(usuario[0]);
            }
            res.status(404).json({ text: "El email no está registrado" });
        });
    }
    registrarUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usuario = req.body;
                // Encriptar la contraseña
                const salt = yield bcryptjs_1.default.genSalt(10);
                usuario.password = yield bcryptjs_1.default.hash(usuario.password, salt);
                const result = yield connection_1.default.query("INSERT INTO usuarios SET ?", [usuario]);
                const transporter = nodemailer.createTransport({
                    service: "Gmail",
                    auth: {
                        user: "voluntex23@gmail.com",
                        pass: "ltia vczr lbcc zayu",
                    },
                });
                const mailOptions = {
                    from: "voluntex23@gmail.com",
                    to: usuario.email,
                    subject: "Bienvenido a la aplicación Voluntex",
                    html: `<H1>Hola ${usuario.nombre},</H1>
          <p>Estamos muy felices de que hayas decidido unirte a Voluntex, juntos lograremos hacer un mundo mejor.</p>
          <p>¡Gracias por unirte a nosotros!</p>`,
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error("Error al enviar el correo electrónico:", error);
                    }
                    else {
                        console.log("Correo electrónico enviado:", info.response);
                    }
                });
                res
                    .status(201)
                    .json({
                    message: "Se registró el usuario correctamente",
                    insertedId: result.insertId,
                });
            }
            catch (error) {
                console.error("Error al registrar el usuario:", error);
                res.status(500).json({ message: "Error al registrar el usuario" });
            }
        });
    }
    enviarEmailConfirmacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            function generateVerificationCode() {
                return Math.floor(100000 + Math.random() * 900000).toString();
            }
            try {
                const email = req.params.email;
                const codigo = generateVerificationCode();
                const transporter = nodemailer.createTransport({
                    service: "Gmail",
                    auth: {
                        user: "voluntex23@gmail.com",
                        pass: "ltia vczr lbcc zayu",
                    },
                });
                const mailOptions = {
                    from: "voluntex23@gmail.com",
                    to: email,
                    subject: "Código de verificación",
                    html: `<H2>Hola, nos enteramos que estás intentando reestablecer tu contraseña.</H2>
          <p>El código de verificación que necesitas es el siguiente:</p>
          <h3>${codigo}</h3>
          <p><strong>Si no deseas realizar esta acción solo ignora este mensaje</strong></p>
          <p>¡Gracias por confiar en nosotros!</p>`,
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error("Error al enviar el correo electrónico:", error);
                    }
                    else {
                        console.log("Correo electrónico enviado:", info.response);
                    }
                });
                res
                    .status(201)
                    .json({
                    message: "Se envió el correo correctamente",
                    insertedId: codigo,
                });
            }
            catch (error) {
                console.error("Error al enviar el código:", error);
                res.status(500).json({ message: "Error al enviar el código" });
            }
        });
    }
    modificarUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                console.log(req.body);
                // Verifica que usuario esté definido
                if (!req.body) {
                    res.status(400).json({ message: "No se proporcionaron datos de usuario" });
                    return;
                }
                // Verifica si se ha proporcionado una nueva contraseña
                if (req.body.password) {
                    // Encripta la nueva contraseña
                    const salt = yield bcryptjs_1.default.genSalt(10);
                    req.body.password = yield bcryptjs_1.default.hash(req.body.password, salt);
                }
                yield connection_1.default.query("UPDATE usuarios SET ? WHERE id = ?", [req.body, id]);
                res.json({ message: "El usuario ha sido actualizado" });
            }
            catch (error) {
                console.error("Error al modificar el usuario:", error);
                res.status(500).json({ message: "Error al modificar el usuario" });
            }
        });
    }
    eliminarUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield connection_1.default.query("DELETE FROM usuarios WHERE id = ?", [id]);
                res.json({ message: "El usuario ha sido eliminado" });
            }
            catch (error) {
                console.error("Error al eliminar el usuario:", error);
                res.status(500).json({ message: "Error al eliminar el usuario" });
            }
        });
    }
    inicio_sesion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const result = yield connection_1.default.query("SELECT u.id, u.nombre, u.apePat, u.apeMat, u.password, u.rol FROM usuarios as u WHERE u.email = ?", [email]);
                if (result.length > 0) {
                    const user = result[0];
                    const passwordMatch = yield bcryptjs_1.default.compare(password, user.password);
                    if (passwordMatch) {
                        const payload = {
                            id: user.id,
                            nombre: `${user.nombre} ${user.apePat} ${user.apeMat}`,
                            rol: user.rol,
                        };
                        const token = jsonwebtoken_1.default.sign(payload, 'oxIJjs8XYPjNk1hXsaeoybsVU9tx90byhpU6FSa90--6iWM45UlsDkFG5X9q4Rs3');
                        res.status(200).json({ message: 'El usuario se ha logueado', token });
                    }
                    else {
                        res.status(401).json({ message: 'Credenciales incorrectas' });
                    }
                }
                else {
                    res.status(401).json({ message: 'Credenciales incorrectas' });
                }
            }
            catch (error) {
                console.error('Error al iniciar sesión:', error);
                res.status(500).json({ message: 'Error al iniciar sesión' });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const result = yield connection_1.default.query("SELECT u.id, u.nombre, u.apePat, u.apeMat, u.password, u.rol FROM usuarios as u WHERE u.email = ?", [email]);
                if (result.length > 0) {
                    const user = result[0];
                    const passwordMatch = yield bcryptjs_1.default.compare(password, user.password);
                    if (passwordMatch) {
                        const otp = this.generateOtp();
                        const expires = Date.now() + 120000; // Tiempo de vida del OTP: 2 minutos
                        this.otps[email] = { otp, expires };
                        const payload = {
                            id: user.id,
                            nombre: `${user.nombre} ${user.apePat} ${user.apeMat}`,
                            rol: user.rol
                        };
                        const token = jsonwebtoken_1.default.sign(payload, 'oxIJjs8XYPjNk1hXsaeoybsVU9tx90byhpU6FSa90--6iWM45UlsDkFG5X9q4Rs3');
                        const transporter = nodemailer.createTransport({
                            service: "Gmail",
                            auth: {
                                user: "voluntex23@gmail.com",
                                pass: "ltia vczr lbcc zayu",
                            },
                        });
                        const mailOptions = {
                            from: "voluntex23@gmail.com",
                            to: email,
                            subject: "Tu código de autenticación",
                            html: `<H2>¡Hola!, un gusto vernos de nuevo.</H2>
            <p>Tu código de autenticación es:</p>
            <h3>${otp}</h3>
            <p><strong>Este código expira en dos minutos</strong></p>`,
                        };
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.error("Error al enviar el correo electrónico:", error);
                                res.status(500).json({ message: "Error al enviar el correo electrónico" });
                            }
                            else {
                                console.log("Correo electrónico enviado: " + info.response);
                                res.status(200).json({
                                    message: "OTP enviado a tu correo electrónico",
                                    token
                                });
                            }
                        });
                    }
                    else {
                        res.status(401).json({ message: "Credenciales incorrectas" });
                    }
                }
                else {
                    res.status(401).json({ message: "Credenciales incorrectas" });
                }
            }
            catch (error) {
                console.error("Error al iniciar sesión:", error);
                res.status(500).json({ message: "Error al iniciar sesión" });
            }
        });
    }
    validarTelefonoEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, telefono } = req.body;
                // Verificar si el correo ya está registrado
                const usuarioCorreo = yield connection_1.default.query("SELECT * FROM usuarios WHERE email = ?", [email]);
                if (usuarioCorreo.length > 0) {
                    return res.status(400).json({ message: "El correo electrónico ya ha sido registrado" });
                }
                // Verificar si el teléfono ya está registrado
                const usuarioTelefono = yield connection_1.default.query("SELECT * FROM usuarios WHERE telefono = ?", [telefono]);
                if (usuarioTelefono.length > 0) {
                    return res.status(400).json({ message: "El teléfono ya ha sido registrado" });
                }
                // Si el correo y el teléfono no están registrados, retornar éxito
                res.status(200).json({ message: "El correo y el teléfono están disponibles para registro" });
            }
            catch (error) {
                console.error("Error al validar el correo y el teléfono:", error);
                res.status(500).json({ message: "Error al validar el correo y el teléfono" });
            }
        });
    }
    generateOtp() {
        const otp = Math.floor(100000 + Math.random() * 900000);
        return otp.toString();
    }
    verifyOtp(req, res) {
        const { email, otp } = req.body;
        if (this.otps[email] &&
            this.otps[email].otp === otp &&
            this.otps[email].expires > Date.now()) {
            res.status(200).json({ message: "OTP verificado correctamente" });
            delete this.otps[email]; // Eliminar OTP después de ser usado
        }
        else {
            res.status(400).json({ message: "OTP incorrecto o expirado" });
        }
    }
}
exports.usuarioController = new UsuarioController();
exports.default = exports.usuarioController;
