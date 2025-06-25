import { promises as fs } from "fs";
import path from "path";

export default defineEventHandler(async () => {

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

	return tasks;
});
