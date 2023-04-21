import { Model, Types } from "mongoose";
import IUser from "../user/user.type";
import { IChatChannel } from "../chatChannel/chatChannel.type";

export interface IClass {
  // id of the class, should sync with discussion id
  classId: string; // todo: custom object id
  name: string;
  // list of users that have control over the class
  instructors: Types.Array<IUser>;
  // list of users that take the class
  students: Types.Array<IUser>;
  // short code to join class directly
  code: string;
  materials: Types.Array<any>; // todo: material DS
  // chatChannel id for discussion
  discussion: IChatChannel;
  associate?: string; // todo: school DS
  tasks: Array<object>; // todo: construct the DS
}

export interface IClassMethods {
  // the methods for the class
  alert: (message: string) => void;
}

export type ClassModel = Model<IClass, object, IClassMethods>;
