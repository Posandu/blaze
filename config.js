import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const config = {
	TEST_DIR: path.join(__dirname, "test"),
	OUT_DIR: path.join(__dirname, "out"),
};
