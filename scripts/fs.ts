// fileUtils.ts
import { File, Paths } from "expo-file-system/next";

const FILE_NAME = "user-data.txt";

/**
 * Writes content to user-data.txt
 */
export async function writeUserData(content: string): Promise<void> {
  try {
    const file = new File(Paths.cache, FILE_NAME);

    // ✅ Await async methods
    await file.create({ overwrite: true });
    await file.write(content);

    const text = await file.text();

    alert("✅ File written successfully!");
    alert("📄 Content: " + text);
  } catch (error) {
    alert("❌ Error writing file");
    console.error("Error writing file:", error);
  }
}

/**
 * Reads content from user-data.txt
 */
export async function readUserData(): Promise<string | null> {
  try {
    const file = new File(Paths.cache, FILE_NAME);

    if (!file.exists) {//FIX: property, not a function
      console.warn("File does not exist yet.");
      return null;
    }

    const data = await file.text();
    return data;
  } catch (error) {
    console.error("❌ Error reading file:", error);
    return null;
  }
}
