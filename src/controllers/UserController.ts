import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Importa jsonwebtoken correctamente
import User from "../models/User"; // Asegúrate de importar el modelo de usuario

// Función para registrar un usuario
export const registerUser = async (req: Request, res: Response) => {
  const { username, lastname, birthdate, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "❌ Este correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      lastname,
      birthdate,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({ message: "✅ Registro exitoso" });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "❌ Error al registrar el usuario",
        error: error.message,
      });
  }
};

// Función para iniciar sesión
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log("Usuario encontrado:", user); // Verifica si el usuario está siendo encontrado correctamente
    if (!user) {
      return res
        .status(400)
        .json({ message: "❌ Usuario o contraseña incorrectos" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Contraseña válida:", isPasswordValid); // Verifica si la contraseña es válida
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "❌ Usuario o contraseña incorrectos" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!, // Usa la clave secreta desde el .env
      { expiresIn: "1h" }
    );
    console.log("Token generado:", token); // Log para verificar el token generado

    return res.status(200).json({
      message: "✅ Inicio de sesión exitoso",
      token, // Retorna el token JWT
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res
      .status(500)
      .json({
        message: "❌ Error al intentar iniciar sesión",
        error: error.message,
      });
  }
};
