import path from "path";
import { promises as fs } from "fs";
import z from "zod";
import { responseResult } from "~/shared/types";

const BodySchema = z.object({
	title: z.string(),
});

export default defineEventHandler(async (event) => {
	const id = event.context.params?.id;

	if (!id) {
		return responseResult(400, "Missing task ID in route");
	}

	const body = await readBody(event);
	const parsedBody = BodySchema.safeParse(body);

	if (!parsedBody.success) {
		return responseResult(400, "Invalid request body");
	}

	const taskToUpdate = { id, title: parsedBody.data.title };

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

	const currentTaskIndex = tasks.findIndex(task => task.id == taskToUpdate.id);

	if (currentTaskIndex === -1) {
		return responseResult(404, "Task not found");
	}

	tasks.splice(currentTaskIndex, 1, taskToUpdate);
	await fs.writeFile(desktopPath, tasks.map(task => JSON.stringify(task)).join("\n") + "\n");

	return responseResult(200);
});
