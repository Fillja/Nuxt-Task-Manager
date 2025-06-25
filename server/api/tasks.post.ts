import { z } from "zod";
import { promises as fs } from "fs";
import path from "path";

const TaskSchema = z.object({
	id: z.string(),
	title: z.string()
});

export default defineEventHandler(async (event) => {
	const body = await readBody(event);

	const result = TaskSchema.safeParse(body);

	if (!result.success) {
		return sendError(
			event,
			createError({
				statusCode: 422,
				statusMessage: "Invalid task",
				message: JSON.stringify(result.error.format()),
			}),
		);
	}

	const desktopPath = path.join(process.env.HOME || process.env.USERPROFILE || "", "Desktop", "tasks.txt");
	await fs.appendFile(desktopPath, JSON.stringify(result.data) + "\n");

	return { task: result.data };
});
