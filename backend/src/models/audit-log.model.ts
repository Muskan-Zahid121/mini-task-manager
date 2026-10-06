import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { ACTORS, Actor } from "../constants/actors";
import { TASK_STATUSES, TaskStatus } from "../constants/statuses";

export class AuditLog extends Model {
  declare id: string;
  declare taskId: string;
  declare actor: Actor;
  declare fromStatus: TaskStatus;
  declare toStatus: TaskStatus;
  declare createdAt: Date;
}

AuditLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    taskId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    actor: {
      type: DataTypes.ENUM(...ACTORS),
      allowNull: false
    },
    fromStatus: {
      type: DataTypes.ENUM(...TASK_STATUSES),
      allowNull: false
    },
    toStatus: {
      type: DataTypes.ENUM(...TASK_STATUSES),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: "AuditLog",
    tableName: "audit_logs",
    updatedAt: false,
    indexes: [
      { fields: ["task_id"] },
      { fields: ["created_at"] }
    ]
  }
);
