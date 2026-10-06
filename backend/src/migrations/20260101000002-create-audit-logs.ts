import { DataTypes, QueryInterface, Sequelize } from "sequelize";

const ACTORS = ["john.doe", "jane.doe", "admin.user"] as const;
const TASK_STATUSES = ["to_do", "pending", "in_progress", "done"] as const;

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable("audit_logs", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    task_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "tasks",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    },
    actor: {
      type: DataTypes.ENUM(...ACTORS),
      allowNull: false
    },
    from_status: {
      type: DataTypes.ENUM(...TASK_STATUSES),
      allowNull: false
    },
    to_status: {
      type: DataTypes.ENUM(...TASK_STATUSES),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
    }
  });

  await queryInterface.addIndex("audit_logs", ["task_id"]);
  await queryInterface.addIndex("audit_logs", ["created_at"]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable("audit_logs");
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_audit_logs_actor";');
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_audit_logs_from_status";');
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_audit_logs_to_status";');
}
