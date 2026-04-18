import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { roomSchema, type Room } from "./schema";

const LIBRARY_ROOT = () => process.env.LIBRARY_PATH || process.cwd();

export async function loadRoom(id: string): Promise<Room> {
  const filePath = path.join(LIBRARY_ROOT(), "rooms", `${id}.md`);
  const source = await readFile(filePath, "utf8");
  const parsed = matter(source);
  return roomSchema.parse(parsed.data);
}

export async function loadRooms(): Promise<Room[]> {
  const dir = path.join(LIBRARY_ROOT(), "rooms");
  const files = await readdir(dir);
  const rooms = await Promise.all(
    files
      .filter((f) => f.endsWith(".md"))
      .map((f) => loadRoom(f.replace(/\.md$/, ""))),
  );
  return rooms.sort((a, b) => a.order - b.order);
}
