import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function filePath(filename: string): string {
  return path.resolve(__dirname, "../../public/data/uploads", filename);
}
