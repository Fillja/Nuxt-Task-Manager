import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import { responseResult } from "~/shared/types";

const TaskSchema = z.object({
	id: z.string(),
	title: z.string(),
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

	try {
		const existingContent = await fs.readFile(desktopPath, "utf8");
		if (!existingContent.endsWith("\n")) {
			await fs.appendFile(desktopPath, "\n");
		}
	}
	catch (error) {
		return responseResult(500, error.message || "Failed to read or create tasks file");
	}

	await fs.appendFile(desktopPath, JSON.stringify(result.data) + "\n");

	return responseResult(201, "", result.data);
});
