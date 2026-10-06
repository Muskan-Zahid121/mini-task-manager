import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { TASK_STATUSES, TaskStatus } from "../constants/statuses";

export class Task extends Model {
  declare id: string;
  declare title: string;
  declare status: TaskStatus;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
}

Task.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(...TASK_STATUSES),
      allowNull: false,
      defaultValue: "to_do"
    }
  },
  {
    sequelize,
    modelName: "Task",
    tableName: "tasks",
    paranoid: true,
    indexes: [
      { fields: ["status"] },
      { fields: ["deleted_at"] },
      { fields: ["created_at"] }
    ]
  }
);
