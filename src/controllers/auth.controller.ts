import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare module "express" {
  interface Request {
    user?: any;
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Obtener el token del encabezado de la solicitud
  const token = req.header("Authorization")?.split(" ")[1];

  // Verificar si el token existe
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "D3jP#Qr!sT*uXwZ8yA@v"
    );

    // Agrega la información del usuario al objeto de solicitud
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
