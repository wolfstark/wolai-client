import { MemoryCookieStore, fromJSON } from "tough-cookie";
import { JsonStore } from "./JsonStore";
const cookieJsonStore = new JsonStore("cookies");
class CookieStore extends MemoryCookieStore {
  constructor() {
    super();
    this.idx = {};
    this.saving = false;
    this.needSave = false;
    this.load();
  }
  load() {
    const cookies = cookieJsonStore.get() || {};
    for (const domainName in cookies) {
      for (const pathName in cookies[domainName]) {
        for (const cookieName in cookies[domainName][pathName]) {
          cookies[domainName][pathName][cookieName] = fromJSON(
            JSON.stringify(cookies[domainName][pathName][cookieName])
          );
        }
      }
    }
    this.idx = cookies;
  }
  async save() {
    this.needSave = true;
    if (!this.saving) {
      this.saving = true;
      this.needSave = false;
      await cookieJsonStore.set(this.idx);
      this.saving = false;
      if (this.needSave) {
        await this.save();
      }
    }
  }
  putCookie(cookie, cb) {
    super.putCookie(cookie, () => {
      this.save().then(cb);
    });
  }
  removeCookie(domain, path, key, cb) {
    super.removeCookie(domain, path, key, () => {
      this.save().then(cb);
    });
  }
  removeCookies(domain, path, cb) {
    super.removeCookies(domain, path, () => {
      this.save().then(cb);
    });
  }
  async reset() {
    this.idx = {};
    await this.save();
  }
}
const _default = CookieStore;
export { _default as default };
