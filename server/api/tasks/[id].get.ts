import { z } from "zod"
import { promises as fs } from "fs";
import path from "path";

const idParamsSchema = z.object({
    id: z.string()
})

export default defineEventHandler(async (event) => {

    const result = getValidatedRouterParams(event, idParamsSchema.safeParse);

    if (!(await result).success) {
        return sendError(event, createError({
            statusCode: 422,
            statusMessage: "Invalid id"
        }));
    }

    const taskId = (await result).data;
    if (!taskId) {
        return sendError(event, createError({
            statusCode: 422,
            statusMessage: "Invalid id"
        }));
    }
    const { id } = taskId;
    const desktopPath = path.join(process.env.HOME || process.env.USERPROFILE || "", "Desktop", "tasks.txt");
    const fileContent = await fs.readFile(desktopPath, "utf-8");
    const tasks = fileContent
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => {
            try {
                return JSON.parse(line);
            } catch {
                return null;
            }
        })
        .filter(Boolean);

    const task = tasks.find((t: any) => t.id === id);

    if (!task) {
        return sendError(event, createError({
            statusCode: 404,
            statusMessage: "Task not found"
        }));
    }

    return task;
});