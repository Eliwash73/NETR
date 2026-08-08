import type { SQLiteDatabase } from "expo-sqlite";

//
// Types
//

export interface Pod {
  id: number;
  pod_name: string;
  pod_color: string;
}

export interface PodItem {
  id: number;
  pod_id: number;
  pod_color: string;
  pod_item_name: string;
  pod_item_quantity: number;
  pod_item_quantity_unit: string;
  pod_item_date: string;
  pod_category: string;
}

//
// Database Initialization
//

export async function initializeDatabase(db: SQLiteDatabase) {

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS pods (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pod_name TEXT NOT NULL,
      pod_color TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS pod_item (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pod_id INTEGER NOT NULL,
      pod_color TEXT,
      pod_item_name TEXT,
      pod_item_quantity REAL,
      pod_item_quantity_unit TEXT,
      pod_item_date TEXT,
      pod_category TEXT,
      FOREIGN KEY (pod_id) REFERENCES pods(id) ON DELETE CASCADE
    );
  `);
}

//
// Pods
//

export async function fetchPods(db: SQLiteDatabase): Promise<Pod[]> {
  return db.getAllAsync<Pod>("SELECT * FROM pods ORDER BY id");
}

export async function addPod(
  db: SQLiteDatabase,
  podName: string,
  podColor: string,
): Promise<number> {
  const result = await db.runAsync(
    "INSERT INTO pods (pod_name, pod_color) VALUES (?, ?)",
    [podName, podColor],
  );
  console.log(`New pod added with ID: ${result.lastInsertRowId}`);
  return Number(result.lastInsertRowId);
}

export async function deletePod(db: SQLiteDatabase, id: number) {
  return db.runAsync("DELETE FROM pods WHERE id = ?", [id]);
}

export async function updatePodName(
  db: SQLiteDatabase,
  newName: string,
  podId: number,
) {
  return db.runAsync("UPDATE pods SET pod_name = ? WHERE id = ?", [
    newName,
    podId,
  ]);
}

export async function updatePodColor(
  db: SQLiteDatabase,
  newColor: string,
  podId: number,
) {
  return db.runAsync("UPDATE pods SET pod_color = ? WHERE id = ?", [
    newColor,
    podId,
  ]);
}

//
// Pod Items
//

export async function fetchPodsItems(
  db: SQLiteDatabase,
  podId: number,
): Promise<PodItem[]> {
  return db.getAllAsync<PodItem>(
    "SELECT * FROM pod_item WHERE pod_id = ? ORDER BY id",
    [podId],
  );
}

export async function fetchAllPodsItems(
  db: SQLiteDatabase,
): Promise<PodItem[]> {
  return db.getAllAsync<PodItem>("SELECT * FROM pod_item ORDER BY id");
}

export async function addPodItem(
  db: SQLiteDatabase,
  podId: number,
  podColor: string,
  podItemName: string,
  podItemQuantity: number,
  podItemQuantityUnit: string,
  podItemDate: string,
  podCategory: string,
): Promise<number> {
  const result = await db.runAsync(
    `INSERT INTO pod_item (
      pod_id,
      pod_color,
      pod_item_name,
      pod_item_quantity,
      pod_item_quantity_unit,
      pod_item_date,
      pod_category
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      podId,
      podColor,
      podItemName,
      podItemQuantity,
      podItemQuantityUnit,
      podItemDate,
      podCategory,
    ],
  );

  return Number(result.lastInsertRowId);
}

export async function deletePodItem(db: SQLiteDatabase, id: number) {
  return db.runAsync("DELETE FROM pod_item WHERE id = ?", [id]);
}

//
// Calendar
//

export interface ExpirationItem {
  pod_item_name: string;
  pod_item_date: string;
  pod_color: string;
}

export async function fetchExpirations(
  db: SQLiteDatabase,
): Promise<ExpirationItem[]> {
  return db.getAllAsync<ExpirationItem>(
    `SELECT
      pod_item_name,
      pod_item_date,
      pod_color
     FROM pod_item`,
  );
}
