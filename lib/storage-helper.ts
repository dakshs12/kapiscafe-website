import fs from "fs/promises";
import path from "path";

// Memory cache for active serverless instance
const memoryCache: Record<string, any> = {};

// Optional KV / Upstash Redis credentials
const rawKvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const kvUrl = rawKvUrl ? rawKvUrl.replace(/\/$/, "") : undefined;
const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

async function executeKvCommand(command: string[]): Promise<any> {
  if (!kvUrl || !kvToken) return null;
  try {
    const res = await fetch(kvUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${kvToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`KV command [${command[0]}] failed with status:`, res.status);
      return null;
    }
    const json = await res.json();
    return json?.result;
  } catch (err) {
    console.error(`KV command [${command[0]}] execution error:`, err);
    return null;
  }
}

/**
 * Universal reader for JSON datasets (menu, cake-orders, cake-config)
 */
export async function readJsonStorage<T>(
  key: string,
  filename: string,
  defaultValue: T
): Promise<T> {
  // 1. Try Cloud KV if configured
  if (kvUrl && kvToken) {
    const kvResult = await executeKvCommand(["GET", key]);
    if (kvResult !== null && kvResult !== undefined) {
      try {
        const parsed = typeof kvResult === "string" ? JSON.parse(kvResult) : kvResult;
        memoryCache[key] = parsed;
        return parsed as T;
      } catch (e) {
        console.error(`Failed to parse KV value for key "${key}":`, e);
      }
    }
  }

  // 2. Try In-Memory Cache
  if (memoryCache[key] !== undefined) {
    return memoryCache[key] as T;
  }

  // 3. Try /tmp file (which might have been written in this or recent serverless invocations)
  try {
    const tmpPath = path.join("/tmp", "kapis-data", filename);
    const content = await fs.readFile(tmpPath, "utf8");
    const parsed = JSON.parse(content);
    memoryCache[key] = parsed;
    return parsed as T;
  } catch {
    // File not in /tmp, proceed to local bundled file
  }

  // 4. Try bundled local file (process.cwd()/data/filename)
  try {
    const localPath = path.join(process.cwd(), "data", filename);
    const content = await fs.readFile(localPath, "utf8");
    const parsed = JSON.parse(content);
    memoryCache[key] = parsed;

    // Auto-seed to KV if KV is connected but empty
    if (kvUrl && kvToken) {
      executeKvCommand(["SET", key, JSON.stringify(parsed)]).catch((err) =>
        console.error(`Auto-seed to KV for ${key} failed:`, err)
      );
    }

    return parsed as T;
  } catch (err) {
    console.warn(`Could not read bundled file for ${filename}, using default value.`);
    return defaultValue;
  }
}


/**
 * Universal writer for JSON datasets (menu, cake-orders, cake-config)
 */
export async function writeJsonStorage<T>(
  key: string,
  filename: string,
  data: T
): Promise<void> {
  // 1. Update in-memory cache immediately
  memoryCache[key] = data;

  // 2. Save to Cloud KV if configured
  if (kvUrl && kvToken) {
    try {
      await executeKvCommand(["SET", key, JSON.stringify(data)]);
    } catch (kvErr) {
      console.error(`Error saving key "${key}" to KV:`, kvErr);
    }
  }

  let writtenToLocal = false;

  // 3. Attempt write to local repository directory (works in local dev and writable servers)
  try {
    const localPath = path.join(process.cwd(), "data", filename);
    await fs.mkdir(path.dirname(localPath), { recursive: true });
    await fs.writeFile(localPath, JSON.stringify(data, null, 2), "utf8");
    writtenToLocal = true;
  } catch (localErr: any) {
    // In read-only filesystems (e.g. AWS Lambda / Vercel), localPath is not writable.
    // This is expected on Vercel and handled gracefully below.
    console.warn(
      `Local filesystem read-only or unwritable for ${filename} (${localErr.code || localErr.message}). Using /tmp fallback.`
    );
  }

  // 4. Also write to /tmp (always writable on Vercel and Linux serverless)
  try {
    const tmpDir = path.join("/tmp", "kapis-data");
    await fs.mkdir(tmpDir, { recursive: true });
    await fs.writeFile(
      path.join(tmpDir, filename),
      JSON.stringify(data, null, 2),
      "utf8"
    );
  } catch (tmpErr: any) {
    console.error(`Error writing to /tmp for ${filename}:`, tmpErr);
    if (!writtenToLocal && !(kvUrl && kvToken)) {
      throw new Error(`Failed to save ${filename}: ${tmpErr.message || "Disk write error"}`);
    }
  }
}
