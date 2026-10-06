import { DataTypes, QueryInterface, Sequelize } from "sequelize";

const TASK_STATUSES = ["to_do", "pending", "in_progress", "done"] as const;

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable("tasks", {
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
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  });

  await queryInterface.addIndex("tasks", ["status"]);
  await queryInterface.addIndex("tasks", ["deleted_at"]);
  await queryInterface.addIndex("tasks", ["created_at"]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable("tasks");
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_tasks_status";');
}
