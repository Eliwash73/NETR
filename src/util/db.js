import * as SQLite from "expo-sqlite";

// Singleton database connection instance
let dbInstance = null;

/**
 * Get or create the singleton database connection
 * This ensures we reuse the same connection instead of creating new ones for each operation
 */
const getDatabase = async () => {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync("pod.db", {
      useNewConnection: false,
    });
    // Enable foreign key constraints for referential integrity
    await dbInstance.execAsync("PRAGMA journal_mode = WAL;");
    await dbInstance.execAsync("PRAGMA foreign_keys = ON;");
  }
  return dbInstance;
};

/**
 * Initialize the pods table if it doesn't exist
 */
export const initPodDb = async () => {
  const db = await getDatabase();
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS pods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pod_name TEXT,
        pod_color TEXT
      );
    `);
  } catch (error) {
    throw new Error(`Failed to initialize pods table: ${error.message}`);
  }
};
/**
 * Initialize the pod_item table if it doesn't exist
 */
export const initPodItemDb = async () => {
  const db = await getDatabase();
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS pod_item (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pod_id INTEGER,
        pod_color TEXT,
        pod_item_name TEXT,
        pod_item_quantity REAL,
        pod_item_quantity_unit TEXT,
        pod_item_date TEXT,
        pod_category TEXT,
        FOREIGN KEY(pod_id) REFERENCES pods(id) ON DELETE CASCADE
      );
    `);
  } catch (error) {
    throw new Error(`Failed to initialize pod_item table: ${error.message}`);
  }
};

/**
 * Add a new pod to the database
 * @param {string} podName - Name of the pod
 * @param {string} podColor - Color of the pod
 * @returns {number} The ID of the newly created pod
 */
export const addPod = async (podName, podColor) => {
  const db = await getDatabase();
  const statement = await db.prepareAsync(
    "INSERT INTO pods (pod_name, pod_color) VALUES (?, ?)",
  );

  try {
    const result = await statement.executeAsync([podName, podColor]);
    return result.lastInsertRowId;
  } catch (error) {
    throw new Error(`Failed to add pod: ${error.message}`);
  } finally {
    await statement.finalizeAsync();
  }
};

/**
 * Add a new item to a pod
 * @returns {number} The ID of the newly created pod item
 */
export const addPodItem = async (
  podId,
  podColor,
  podItemName,
  podItemQuantity,
  podItemQuantityUnit,
  podItemDate,
  podCategory,
) => {
  const db = await getDatabase();
  const statement = await db.prepareAsync(`
    INSERT INTO pod_item (
      pod_id,
      pod_color,
      pod_item_name,
      pod_item_quantity,
      pod_item_quantity_unit,
      pod_item_date,
      pod_category
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  try {
    const result = await statement.executeAsync([
      podId,
      podColor,
      podItemName,
      podItemQuantity,
      podItemQuantityUnit,
      podItemDate,
      podCategory,
    ]);
    return result.lastInsertRowId;
  } catch (error) {
    throw new Error(`Failed to add pod item: ${error.message}`);
  } finally {
    await statement.finalizeAsync();
  }
};

/**
 * Delete a pod by ID (cascade deletes all items in this pod)
 * @param {number} id - Pod ID to delete
 */
export const deletePod = async (id) => {
  const db = await getDatabase();
  const statement = await db.prepareAsync("DELETE FROM pods WHERE id = ?");

  try {
    return await statement.executeAsync([id]);
  } catch (error) {
    throw new Error(`Failed to delete pod: ${error.message}`);
  } finally {
    await statement.finalizeAsync();
  }
};

/**
 * Delete a pod item by ID
 * @param {number} id - Pod item ID to delete
 */
export const deletePodItem = async (id) => {
  const db = await getDatabase();
  const statement = await db.prepareAsync("DELETE FROM pod_item WHERE id = ?");

  try {
    return await statement.executeAsync([id]);
  } catch (error) {
    throw new Error(`Failed to delete pod item: ${error.message}`);
  } finally {
    await statement.finalizeAsync();
  }
};

/**
 * Fetch all pods
 * @returns {Array} Array of all pods
 */
export const fetchPods = async () => {
  const db = await getDatabase();
  try {
    return await db.getAllAsync("SELECT * FROM pods");
  } catch (error) {
    throw new Error(`Failed to fetch pods: ${error.message}`);
  }
};

/**
 * Fetch all items for a specific pod
 * @param {number} podID - The pod ID to fetch items for
 * @returns {Array} Array of pod items
 */
export const fetchPodsItems = async (podID) => {
  const db = await getDatabase();
  try {
    return await db.getAllAsync("SELECT * FROM pod_item WHERE pod_id = ?", [
      podID,
    ]);
  } catch (error) {
    throw new Error(`Failed to fetch pod items: ${error.message}`);
  }
};

/**
 * Fetch all items from all pods
 * @returns {Array} Array of all pod items
 */
export const fetchAllPodsItems = async () => {
  const db = await getDatabase();
  try {
    return await db.getAllAsync("SELECT * FROM pod_item");
  } catch (error) {
    throw new Error(`Failed to fetch all pod items: ${error.message}`);
  }
};

/**
 * Update a pod's name
 * @param {string} newName - New name for the pod
 * @param {number} podId - Pod ID to update
 */
export const updatePodName = async (newName, podId) => {
  const db = await getDatabase();
  try {
    return await db.runAsync("UPDATE pods SET pod_name = ? WHERE id = ?", [
      newName,
      podId,
    ]);
  } catch (error) {
    throw new Error(`Failed to update pod name: ${error.message}`);
  }
};

/**
 * Update a pod's color
 * @param {string} newColor - New color for the pod
 * @param {number} podId - Pod ID to update
 */
export const updatePodColor = async (newColor, podId) => {
  const db = await getDatabase();
  try {
    return await db.runAsync("UPDATE pods SET pod_color = ? WHERE id = ?", [
      newColor,
      podId,
    ]);
  } catch (error) {
    throw new Error(`Failed to update pod color: ${error.message}`);
  }
};

/**
 * Fetch items for the calendar view (with expiration dates)
 * @returns {Array} Array of items with dates and colors
 */
export const fetchExpirations = async () => {
  const db = await getDatabase();
  try {
    return await db.getAllAsync(
      "SELECT pod_item_name, pod_item_date, pod_color FROM pod_item",
    );
  } catch (error) {
    throw new Error(`Failed to fetch expirations: ${error.message}`);
  }
};
