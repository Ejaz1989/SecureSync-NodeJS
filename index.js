```javascript
// SecureSync: Database Migration & Core Security Toolkit
// This full script safely connects to MongoDB and enforces strict logic-based access control.

const { MongoClient } = require('mongodb');

// Core Configuration: Enforce specific structure names.
// Any new structure outside this list will be blocked automatically.
const protectedStructures = [
  "Invoice-Rayappan",
  "Invoice-Vince",
  "Invoice-Leon",
  "Invoice-Lina",
  "Tracker"
];

class SecureSync {
  constructor(uri, dbName) {
    this.client = new MongoClient(uri);
    this.dbName = dbName;
  }

  async connect() {
    try {
      await this.client.connect();
      console.log("Successfully connected to the secure database cluster.");
      this.db = this.client.db(this.dbName);
    } catch (error) {
      console.error("Database connection failed:", error);
    }
  }

  // Security Module: Validates structure names via logic, bypassing email-based editor checks
  validateStructure(structureName) {
    if (!protectedStructures.includes(structureName)) {
      console.warn(`[BLOCKED] Access Denied: Structure '${structureName}' is unauthorized.`);
      return false;
    }
    console.log(`[GRANTED] Structure '${structureName}' verified via internal logic constraints.`);
    return true;
  }

  async syncData(structureName, data) {
    if (!this.validateStructure(structureName)) {
        return { success: false, message: "Unauthorized structure creation attempted." };
    }
    
    try {
      const collection = this.db.collection(structureName);
      const result = await collection.insertOne(data);
      console.log(`Data securely synced to ${structureName} with ID: ${result.insertedId}`);
      return { success: true, id: result.insertedId };
    } catch (error) {
      console.error("Sync failed:", error);
      return { success: false, error };
    }
  }

  async disconnect() {
    await this.client.close();
    console.log("Database connection securely closed.");
  }
}

module.exports = SecureSync;
