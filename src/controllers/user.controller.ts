import { Request, Response } from "express";
import userService from "../services/user.service";
import { UserInput, UserDocument } from "../models/user.model";
import bcrypt from "bcrypt";
import groupService from "../services/group.service";

class UserController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const userExists: UserDocument | null = await userService.findByEmail(
        req.body.email
      );
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }
      req.body.password = await bcrypt.hash(req.body.password, 10);
      const user: UserDocument = await userService.create(
        req.body as UserInput
      );

      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  public async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const users: UserDocument[] = await userService.findAll();

      // Utiliza la función populate para rellenar los datos de los usuarios en cada grupo
      await Promise.all(users.map((user) => user.populate("groups")));

      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  public async findById(req: Request, res: Response) {
    try {
      const user: UserDocument | null = await userService.findById(
        req.params.id
      );
      if (user === null) {
        return res.status(404).json({ message: "User not found" });
      }

      // Utiliza la función populate para rellenar los datos de los usuarios
      await user.populate("groups");

      return res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const user: UserDocument | null = await userService.findById(
        req.params.id
      );
      if (user === null) {
        return res.status(404).json({ message: "User not found" });
      }
      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
      }
      const updatedUser: UserDocument | null = await userService.update(
        user,
        req.body
      );

      return res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.params.id;
      const deletedUser = await userService.delete(userId);

      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res
        .status(200)
        .json({ message: "User deleted successfully", deletedUser });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  public async getUserGroups(req: Request, res: Response): Promise<Response> {
    try {
      const user = await userService.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Obtiene los grupos del usuario
      const groups = await groupService.findManyByIds(user.groups);

      return res.status(200).json(groups);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  public async login(req: Request, res: Response) {
    try {
      const user: UserDocument | null = await userService.findByEmail(
        req.body.email
      );
      if (!user) {
        return res.status(401).json({ message: "Not authorized" });
      }
      const isMatch = await bcrypt.compare(req.body.password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Bad credentials" });
      }

      const token = await userService.generateToken(user);

      return res.status(200).send({ email: user.email, token });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

export default new UserController();
