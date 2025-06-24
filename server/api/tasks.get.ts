import { promises as fs } from "fs";
import { join } from "path";

export default defineEventHandler(async () => {

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

	return tasks;
});
