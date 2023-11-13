import { Request, Response } from "express";
import groupService from "../services/group.service";
import { GroupInput, GroupDocument } from "../models/group.model";
import { Types } from "mongoose";
import userService from "../services/user.service";
import { UserDocument } from "../models/user.model";

class GroupController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const groupExists: GroupDocument | null = await groupService.findByName(
        req.body.name
      );
      if (groupExists) {
        return res.status(400).json({ message: "Group already exists" });
      }

      // TODO: Verify that the provided users IDs are valid

      const group: GroupDocument = await groupService.create(
        req.body as GroupInput
      );

      // Obtén las referencias a los usuarios a partir de los IDs
      const userIds: Types.ObjectId[] = req.body.users;
      const userReferences = await userService.findManyByIds(userIds);

      // Actualiza cada usuario con la referencia al nuevo grupo
      await Promise.all(
        userReferences.map(async (user) => {
          user.groups.push(group._id);
          await user.save();
        })
      );

      return res.status(201).json(group);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  public async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const groups: GroupDocument[] = await groupService.findAll();

      // Utiliza la función populate para rellenar los datos de los usuarios en cada grupo
      await Promise.all(groups.map((group) => group.populate("users")));

      return res.status(200).json(groups);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  public async findById(req: Request, res: Response) {
    try {
      const group: GroupDocument | null = await groupService.findById(
        req.params.id
      );
      if (group === null) {
        return res.status(404).json({ message: "Group not found" });
      }

      // Utiliza la función populate para rellenar los datos de los usuarios
      await group.populate("users");

      return res.status(200).json(group);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const groupId: Types.ObjectId = new Types.ObjectId(req.params.id);

      const group: GroupDocument | null = await groupService.findById(
        req.params.id
      );
      if (group === null) {
        return res.status(404).json({ message: "Group not found" });
      }

      // Obtén las referencias a los usuarios antes de la actualización
      const previousUserIds: Types.ObjectId[] = group.users;

      const updatedGroup: GroupDocument | null = await groupService.update(
        group,
        req.body
      );

      // Obtén las referencias a los usuarios después de la actualización
      const updatedUserIds: Types.ObjectId[] = req.body.users;

      // Usuarios que fueron eliminados del grupo
      const removedUserIds = previousUserIds.filter(
        (userId) => !updatedUserIds.includes(userId)
      );

      // Elimina la referencia al grupo en cada usuario que fue eliminado del grupo
      await Promise.all(
        removedUserIds.map(async (userId) => {
          const user = await userService.findById(userId.toString());
          if (user) {
            const groupIndexToRemove = user.groups.indexOf(groupId);
            if (groupIndexToRemove !== -1) {
              user.groups.splice(groupIndexToRemove, 1);
              await user.save();
            }
          }
        })
      );

      // Obtén las referencias a los usuarios a partir de los IDs
      const userReferences = await userService.findManyByIds(updatedUserIds);

      // Actualiza cada usuario con la referencia al grupo actualizado
      await Promise.all(
        userReferences.map(async (user) => {
          const groupIndex = user.groups.indexOf(groupId);

          if (groupIndex === -1) {
            user.groups.push(groupId);
          }

          await user.save();
        })
      );

      return res.status(200).json(updatedGroup);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const groupId = req.params.id;
      const deletedGroup = await groupService.delete(groupId);

      if (!deletedGroup) {
        return res.status(404).json({ message: "Group not found" });
      }

      return res
        .status(200)
        .json({ message: "Group deleted successfully", deletedGroup });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  public async getGroupUsers(req: Request, res: Response): Promise<Response> {
    try {
      const group = await groupService.findById(req.params.id);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }

      // Obtiene los usuarios del grupo
      const users = await userService.findManyByIds(group.users);

      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}

export default new GroupController();
