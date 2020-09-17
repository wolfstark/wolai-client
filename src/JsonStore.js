import fs from "fs-extra";
import { app } from "electron";
import { join } from "path";

class JsonStore {
  constructor(name) {
    const userDataPath = app.getPath("userData");
    this.filePath = join(userDataPath, name + ".json");
    this.loadSync();
  }
  get() {
    return this.data;
  }
  async set(value) {
    this.data = value;
    await this.save();
  }
  setSync(value) {
    this.data = value;
    this.saveSync();
  }
  async load() {
    try {
      this.data = await fs.readJSON(this.filePath);
    } catch (error) {
      console.info("Error reading " + this.filePath, error);
    }
  }
  loadSync() {
    try {
      this.data = fs.readJSONSync(this.filePath);
    } catch (error) {
      console.info("Error reading " + this.filePath, error);
    }
  }
  async save() {
    try {
      await fs.writeJSON(this.filePath, this.data);
    } catch (error) {
      console.info("Error writing " + this.filePath, error);
    }
  }
  saveSync() {
    try {
      fs.writeJSONSync(this.filePath, this.data);
    } catch (error) {
      console.info("Error writing " + this.filePath, error);
    }
  }
}
export { JsonStore };
