import { promises as fs } from 'fs';
import { join } from 'path';
import z from 'zod';

export default defineEventHandler(async (event) => {

    const result = await getValidatedRouterParams(event, z.object({ id: z.string() }).safeParse);

    if (!result.success) {
    throw createError({
        statusCode: 400,
        statusMessage: "Invalid id",
    });
    }
    const { id: taskId } = (await result).data;

    const filePath = join("C:/Users/Fillja/Desktop", "tasks.txt");
    const fileContent = await fs.readFile(filePath, "utf-8");
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

    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) {
        throw createError({
            statusCode: 404,
            statusMessage: "Task not found"
        });
    }
    tasks.splice(taskIndex, 1);

    await fs.writeFile(filePath, tasks.map(t => JSON.stringify(t)).join('\n'), "utf-8");
    return { success: true };
});