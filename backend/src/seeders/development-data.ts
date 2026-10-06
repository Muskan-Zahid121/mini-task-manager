import { QueryInterface } from "sequelize";

const DAY = 24 * 60 * 60 * 1000;

export async function up(queryInterface: QueryInterface): Promise<void> {
  const now = Date.now();

  await queryInterface.bulkInsert("tasks", [
    {
      id: "6f1c2b4a-8d3e-4f5a-9b0c-1d2e3f4a5b6c",
      title: "Prepare project documentation",
      status: "to_do",
      created_at: new Date(now - 1 * DAY),
      updated_at: new Date(now - 1 * DAY),
      deleted_at: null
    },
    {
      id: "7a2d3c4b-9e4f-4a6b-8c1d-2e3f4a5b6c7d",
      title: "Review client requirements",
      status: "pending",
      created_at: new Date(now - 2 * DAY),
      updated_at: new Date(now - 10 * 60 * 60 * 1000),
      deleted_at: null
    },
    {
      id: "8b3e4d5c-af50-4b7c-9d2e-3f4a5b6c7d8e",
      title: "Complete API implementation",
      status: "in_progress",
      created_at: new Date(now - 3 * DAY),
      updated_at: new Date(now - 2 * DAY),
      deleted_at: null
    },
    {
      id: "9c4f5e6d-b061-4c8d-ae3f-4a5b6c7d8f9a",
      title: "Update portfolio",
      status: "done",
      created_at: new Date(now - 5 * DAY),
      updated_at: new Date(now - 2 * DAY),
      deleted_at: null
    }
  ]);

  await queryInterface.bulkInsert("audit_logs", [
    {
      id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
      task_id: "7a2d3c4b-9e4f-4a6b-8c1d-2e3f4a5b6c7d",
      actor: "john.doe",
      from_status: "to_do",
      to_status: "pending",
      created_at: new Date(now - 10 * 60 * 60 * 1000)
    },
    {
      id: "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e",
      task_id: "8b3e4d5c-af50-4b7c-9d2e-3f4a5b6c7d8e",
      actor: "jane.doe",
      from_status: "to_do",
      to_status: "pending",
      created_at: new Date(now - 3 * DAY + 60 * 60 * 1000)
    },
    {
      id: "c3d4e5f6-a7b8-4c9d-8e0f-2a3b4c5d6e7f",
      task_id: "8b3e4d5c-af50-4b7c-9d2e-3f4a5b6c7d8e",
      actor: "admin.user",
      from_status: "pending",
      to_status: "in_progress",
      created_at: new Date(now - 2 * DAY)
    },
    {
      id: "d4e5f6a7-b8c9-4d0e-9f1a-3b4c5d6e7f8a",
      task_id: "9c4f5e6d-b061-4c8d-ae3f-4a5b6c7d8f9a",
      actor: "john.doe",
      from_status: "to_do",
      to_status: "pending",
      created_at: new Date(now - 5 * DAY + 2 * 60 * 60 * 1000)
    },
    {
      id: "e5f6a7b8-c9d0-4e1f-8a2b-4c5d6e7f8a9b",
      task_id: "9c4f5e6d-b061-4c8d-ae3f-4a5b6c7d8f9a",
      actor: "jane.doe",
      from_status: "pending",
      to_status: "in_progress",
      created_at: new Date(now - 4 * DAY)
    },
    {
      id: "f6a7b8c9-d0e1-4f2a-9b3c-5d6e7f8a9b0c",
      task_id: "9c4f5e6d-b061-4c8d-ae3f-4a5b6c7d8f9a",
      actor: "admin.user",
      from_status: "in_progress",
      to_status: "done",
      created_at: new Date(now - 2 * DAY)
    }
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete("audit_logs", {});
  await queryInterface.bulkDelete("tasks", {});
}
