import mongoose from "mongoose";
import {
  ClassModel,
  IClass,
  IClassMethods,
} from "../services/class/class.type";

const ClassSchema = new mongoose.Schema<IClass, ClassModel, IClassMethods>({
  name: {
    type: String,
    required: true,
  },
  classId: {
    type: String,
    unique: true, // use id generator
    slug: "name",
  },
  code: {
    type: String,
    unique: true,
    slug: "name",
  },
  discussion: {
    type: mongoose.Types.ObjectId,
    ref: "ChatChannel",
  },
  students: {
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  associate: {
    type: mongoose.Types.ObjectId,
    ref: "", // todo: school DT
  },
  instructors: {
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  tasks: {
    type: [
      {
        // todo: DS of tasks
      },
    ],
  },
});

export default mongoose.model("Class", ClassSchema);
