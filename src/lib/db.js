import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

const ensureDataDir = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (e) {
    // Read-only filesystem on Vercel
  }
};

const getJsonFile = (collectionName) => {
  ensureDataDir();
  return path.join(DATA_DIR, `${collectionName}.json`);
};

const readJson = (collectionName) => {
  try {
    const filePath = getJsonFile(collectionName);
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (e) {
    return [];
  }
};

const writeJson = (collectionName, data) => {
  try {
    const filePath = getJsonFile(collectionName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.warn(`JSON write skipped for '${collectionName}' due to read-only filesystem`);
  }
};

export const db = {
  // Collection helper
  getCollection: async (collectionName) => {
    const client = await clientPromise;
    return client.db().collection(collectionName);
  },

  // Generic CRUD with MongoDB + JSON Fallback
  getAll: async (collectionName, query = {}) => {
    try {
      const col = await db.getCollection(collectionName);
      return await col.find(query).toArray();
    } catch (err) {
      console.warn(`[db.js] MongoDB unavailable, using local JSON storage for '${collectionName}'`);
      let items = readJson(collectionName);
      if (Object.keys(query).length > 0) {
        items = items.filter(item => {
          return Object.entries(query).every(([k, v]) => item[k] === v);
        });
      }
      return items;
    }
  },

  getById: async (collectionName, id) => {
    try {
      const col = await db.getCollection(collectionName);
      return await col.findOne({ _id: new ObjectId(id) });
    } catch (err) {
      const items = readJson(collectionName);
      return items.find(item => item._id === id || item.id === id);
    }
  },

  create: async (collectionName, data) => {
    const newItem = {
      ...data,
      _id: new Date().getTime().toString() + Math.random().toString(36).substring(2, 7),
      createdAt: new Date()
    };
    try {
      const col = await db.getCollection(collectionName);
      const res = await col.insertOne({ ...data, createdAt: new Date() });
      return res;
    } catch (err) {
      console.warn(`[db.js] MongoDB unavailable, writing to local JSON storage for '${collectionName}'`);
      const items = readJson(collectionName);
      items.push(newItem);
      writeJson(collectionName, items);
      return { insertedId: newItem._id };
    }
  },

  update: async (collectionName, id, data) => {
    try {
      const col = await db.getCollection(collectionName);
      return await col.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...data, updatedAt: new Date() } }
      );
    } catch (err) {
      const items = readJson(collectionName);
      const idx = items.findIndex(item => item._id === id || item.id === id);
      if (idx !== -1) {
        items[idx] = { ...items[idx], ...data, updatedAt: new Date() };
        writeJson(collectionName, items);
      }
      return { modifiedCount: 1 };
    }
  },

  delete: async (collectionName, id) => {
    try {
      const col = await db.getCollection(collectionName);
      return await col.deleteOne({ _id: new ObjectId(id) });
    } catch (err) {
      let items = readJson(collectionName);
      items = items.filter(item => item._id !== id && item.id !== id);
      writeJson(collectionName, items);
      return { deletedCount: 1 };
    }
  },

  aggregate: async (collectionName, pipeline) => {
    try {
      const col = await db.getCollection(collectionName);
      return await col.aggregate(pipeline).toArray();
    } catch (err) {
      return readJson(collectionName);
    }
  }
};

