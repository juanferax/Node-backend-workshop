import { Types } from "mongoose";
import GroupModel, { GroupInput, GroupDocument } from "../models/group.model";

class GroupService {
  public async create(userInput: GroupInput): Promise<GroupDocument> {
    try {
      const group = await GroupModel.create(userInput);
      return group;
    } catch (error) {
      throw error;
    }
  }

  public async findByName(name: string): Promise<GroupDocument | null> {
    try {
      const groupExists = await GroupModel.findOne({ name });
      return groupExists;
    } catch (error) {
      throw error;
    }
  }

  public async findById(id: string): Promise<GroupDocument | null> {
    try {
      const group = await GroupModel.findById(id);
      return group;
    } catch (error) {
      throw error;
    }
  }

  public async findManyByIds(
    groupIds: Types.ObjectId[]
  ): Promise<GroupDocument[]> {
    try {
      const users = await GroupModel.find({ _id: { $in: groupIds } });
      return users;
    } catch (error) {
      throw error;
    }
  }

  public async findAll(): Promise<GroupDocument[]> {
    try {
      const groups = await GroupModel.find();
      return groups;
    } catch (error) {
      throw error;
    }
  }

  public async update(
    group: GroupDocument,
    data: GroupInput
  ): Promise<GroupDocument | null> {
    try {
      const groupUpdate: GroupDocument | null =
        await GroupModel.findOneAndUpdate({ _id: group.id }, data, {
          new: true,
        });

      return groupUpdate;
    } catch (error) {
      throw error;
    }
  }

  public async delete(groupId: string): Promise<GroupDocument | null> {
    try {
      const deletedGroup = await GroupModel.findByIdAndRemove(groupId).exec();
      return deletedGroup;
    } catch (error) {
      throw error;
    }
  }
}

export default new GroupService();
