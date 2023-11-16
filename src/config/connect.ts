import dotenv from "dotenv";
import mongoose from "mongoose";
import { UserInput } from "../models/user.model";
import userService from "../services/user.service";
import bcrypt from "bcrypt";

dotenv.config();

const connectionString =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/test";

const createSuperadmin = async () => {
  try {
    const userExists = await userService.findByEmail("admin@admin.com");

    if (!userExists) {
      const superadmin = {
        name: "Superadmin",
        email: "admin@admin.com",
        password: await bcrypt.hash("$up3rAdm1n!", 10),
        role: "superadmin",
      };

      const user = {
        name: "Test",
        email: "test@test.com",
        password: await bcrypt.hash("password", 10),
        role: "user",
      };

      await userService.create(superadmin as UserInput);
      await userService.create(user as UserInput);

      console.log("Usuarios iniciales creados correctamente");
    } else {
      console.log("Datos ya cargados en la base de datos");
    }
  } catch (error) {
    console.error("Error al cargar el usuario superadmin:", error);
  }
};

export const db = mongoose
  .connect(connectionString)
  .then(async (res) => {
    console.log("Connected to MongoDb");
    await createSuperadmin();
  })
  .catch((err) => {
    console.log(err);
  });
