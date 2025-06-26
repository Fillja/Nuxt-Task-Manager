import path from "path";
import { promises as fs } from "fs";
import z from "zod";
import { responseResult } from "~/shared/types";

export default defineEventHandler(async (event) => {
	const result = await getValidatedRouterParams(event, z.object({ id: z.string() }).safeParse);

	if (!result.success) {
		return responseResult(400, "Invalid id");
	}
	const { id: taskId } = (await result).data;

	const desktopPath = path.join(process.env.HOME || process.env.USERPROFILE || "", "Desktop", "tasks.txt");
	const fileContent = await fs.readFile(desktopPath, "utf-8");
	const tasks = fileContent
		.split("\n")
		.map(line => line.trim())
		.filter(Boolean)
		.map((line) => {
			try {
				return JSON.parse(line);
			}
			catch {
				return null;
			}
		})
		.filter(Boolean);

	const taskIndex = tasks.findIndex(task => task.id === taskId);
	if (taskIndex === -1) {
		return responseResult(404, "Task not found");
	}
	tasks.splice(taskIndex, 1);

	await fs.writeFile(desktopPath, tasks.map(t => JSON.stringify(t)).join("\n"), "utf-8");
	return responseResult(200);
});
