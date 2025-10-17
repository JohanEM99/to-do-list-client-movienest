import mongoose from "mongoose";

// Definir el esquema del usuario
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    birthdate: {
      type: Date, // Mejor usar Date para las fechas
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Asegura que no se repitan los correos
      match: [/\S+@\S+\.\S+/, "Por favor, ingrese un correo electrónico válido"], // Validación del formato de correo
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Esto agrega las propiedades createdAt y updatedAt automáticamente
);

// Crear el modelo
const User = mongoose.model("User", userSchema);

export default User;
