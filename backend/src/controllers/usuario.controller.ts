import { Request, Response } from "express";
import pool from "../connection";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const nodemailer = require("nodemailer");

interface OTP {
  otp: string;
  expires: number;
}

class UsuarioController {

  private otps: Record<string, OTP> = {};

  constructor() {
    this.login = this.login.bind(this);
    this.generateOtp = this.generateOtp.bind(this);
    this.verifyOtp = this.verifyOtp.bind(this);
  }

  public async obtenerUsuarios(req: Request, res: Response) {
    const usuarios = await pool.query("SELECT * from usuarios");
    if (usuarios.length > 0) {
      return res.json(usuarios);
    }
  }

  public async verUsuario(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const usuario = await pool.query(
      "SELECT * FROM usuarios WHERE id = ?",[id]
    );
    if (usuario.length > 0) {
      return res.json(usuario[0]);
    }
    res.status(404).json({ text: "El usuario no existe" });
  }

  public async obtenerUsuarioEmail(req: Request, res: Response): Promise<any> {
    const { email } = req.params;
    const usuario = await pool.query(
      "SELECT id, email FROM usuarios WHERE email = ?",[email]
    );
    if (usuario.length > 0) {
      return res.json(usuario[0]);
    }
    res.status(404).json({ text: "El email no está registrado" });
  }

  public async obtenerCredenciales(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const usuario = await pool.query(
      "SELECT email, password FROM usuarios WHERE id = ?",
      [id]
    );
    if (usuario.length > 0) {
      return res.json(usuario[0]);
    }
    res.status(404).json({ text: "El usuario no existe" });
  }

  public async registrarUsuario(req: Request, res: Response): Promise<void> {
    try {
      const usuario = req.body;

      // Encriptar la contraseña
      const salt = await bcrypt.genSalt(10);
      usuario.password = await bcrypt.hash(usuario.password, salt);

      const result = await pool.query("INSERT INTO usuarios SET ?", [usuario]);

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

      transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
          console.error("Error al enviar el correo electrónico:", error);
        } else {
          console.log("Correo electrónico enviado:", info.response);
        }
      });

      res
        .status(201)
        .json({
          message: "Se registró el usuario correctamente",
          insertedId: result.insertId,
        });
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      res.status(500).json({ message: "Error al registrar el usuario" });
    }
  }

  public async enviarEmailConfirmacion(req: Request, res: Response): Promise<void> {
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

      transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
          console.error("Error al enviar el correo electrónico:", error);
        } else {
          console.log("Correo electrónico enviado:", info.response);
        }
      });

      res
        .status(201)
        .json({
          message: "Se envió el correo correctamente",
          insertedId: codigo,
        });
    } catch (error) {
      console.error("Error al enviar el código:", error);
      res.status(500).json({ message: "Error al enviar el código" });
    }
  }

  public async modificarUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { usuario } = req.body;

      console.log(req.body);

      // Verifica que usuario esté definido
      if (!req.body) {
        res.status(400).json({ message: "No se proporcionaron datos de usuario" });
        return
      }

      // Verifica si se ha proporcionado una nueva contraseña
      if (req.body.password) {
        // Encripta la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }

      await pool.query("UPDATE usuarios SET ? WHERE id = ?", [req.body, id]);
      res.json({ message: "El usuario ha sido actualizado" });
    } catch (error) {
      console.error("Error al modificar el usuario:", error);
      res.status(500).json({ message: "Error al modificar el usuario" });
    }
  }

  public async eliminarUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
      res.json({ message: "El usuario ha sido eliminado" });
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      res.status(500).json({ message: "Error al eliminar el usuario" });
    }
  }

  public async inicio_sesion(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await pool.query(
        "SELECT u.id, u.nombre, u.apePat, u.apeMat, u.password, u.rol FROM usuarios as u WHERE u.email = ?",
        [email]
      );
  
      if (result.length > 0) {
        const user = result[0];
  
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
          const payload = {
            id: user.id,
            nombre: `${user.nombre} ${user.apePat} ${user.apeMat}`,
            rol: user.rol,
          };
  
          const token = jwt.sign(payload, 'oxIJjs8XYPjNk1hXsaeoybsVU9tx90byhpU6FSa90--6iWM45UlsDkFG5X9q4Rs3');
          res.status(200).json({ message: 'El usuario se ha logueado', token });
        } else {
          res.status(401).json({ message: 'Credenciales incorrectas' });
        }
      } else {
        res.status(401).json({ message: 'Credenciales incorrectas' });
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ message: 'Error al iniciar sesión' });
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await pool.query(
        "SELECT u.id, u.nombre, u.apePat, u.apeMat, u.password, u.rol FROM usuarios as u WHERE u.email = ?",
        [email]
      );

      if (result.length > 0) {
        const user = result[0];

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
          const otp = this.generateOtp();
          const expires = Date.now() + 120000; // Tiempo de vida del OTP: 2 minutos
          this.otps[email] = { otp, expires };

          const payload = {
            id: user.id,
            nombre: `${user.nombre} ${user.apePat} ${user.apeMat}`,
            rol: user.rol
          };

          const token = jwt.sign(payload, 'oxIJjs8XYPjNk1hXsaeoybsVU9tx90byhpU6FSa90--6iWM45UlsDkFG5X9q4Rs3');

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

          transporter.sendMail(
            mailOptions,
            (error: any, info: { response: string }) => {
              if (error) {
                console.error("Error al enviar el correo electrónico:", error);
                res.status(500).json({ message: "Error al enviar el correo electrónico" });
              } else {
                console.log("Correo electrónico enviado: " + info.response);
                res.status(200).json({
                  message: "OTP enviado a tu correo electrónico",
                  token
                });
              }
            }
          );
        } else {
          res.status(401).json({ message: "Credenciales incorrectas" });
        }
      } else {
        res.status(401).json({ message: "Credenciales incorrectas" });
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      res.status(500).json({ message: "Error al iniciar sesión" });
    }
  }


  public async validarTelefonoEmail(req: Request, res: Response): Promise<any> {
    try {
      const { email, telefono } = req.body;

      // Verificar si el correo ya está registrado
      const usuarioCorreo = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);
      if (usuarioCorreo.length > 0) {
          return res.status(400).json({ message: "El correo electrónico ya ha sido registrado" });
      }

      // Verificar si el teléfono ya está registrado
      const usuarioTelefono = await pool.query("SELECT * FROM usuarios WHERE telefono = ?", [telefono]);
      if (usuarioTelefono.length > 0) {
          return res.status(400).json({ message: "El teléfono ya ha sido registrado" });
      }

      // Si el correo y el teléfono no están registrados, retornar éxito
      res.status(200).json({ message: "El correo y el teléfono están disponibles para registro" });

    } catch (error) {
        console.error("Error al validar el correo y el teléfono:", error);
        res.status(500).json({ message: "Error al validar el correo y el teléfono" });
    }
  }

  public generateOtp(): string {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
  }

  public verifyOtp(req: Request, res: Response): void {
    const { email, otp } = req.body;
    if (
      this.otps[email] &&
      this.otps[email].otp === otp &&
      this.otps[email].expires > Date.now()
    ) {
      res.status(200).json({ message: "OTP verificado correctamente" });
      delete this.otps[email]; // Eliminar OTP después de ser usado
    } else {
      res.status(400).json({ message: "OTP incorrecto o expirado" });
    }
  }

}

export const usuarioController = new UsuarioController();
export default usuarioController;
