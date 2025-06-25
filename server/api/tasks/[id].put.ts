import z from "zod";
import path from 'path';
import { promises as fs } from 'fs';
import { responseResult } from "~/shared/types";

const TaskSchema = z.object({
    id: z.string(),
    title: z.string()
});

export default defineEventHandler(async (event) => {

    const result = await getValidatedRouterParams(event, TaskSchema.safeParse);

    if(!result.success){
        return responseResult(400, "Invalid fields");
    }

    const taskToUpdate = (await result).data;

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

    const currentTask = tasks.find((task) => task.id == taskToUpdate.id);
    console.log(currentTask);

    if(!currentTask){
        return responseResult(404, "Task not found");
    }
});