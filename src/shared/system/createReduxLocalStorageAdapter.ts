import pify from 'pify';
import jsonStorage from 'electron-json-storage';
import * as path from 'path'
import { app } from 'electron'

const storage = pify(jsonStorage);
const pathToDataDir = path.join(app.getPath("home"), ".pshare")
jsonStorage.setDataPath(pathToDataDir)

async function storageImpl(operationAsync: () => Promise<any>, callback: (error: Error | null, v?: any) => void): Promise<void> {
  let v: any;
  try {
    v = await operationAsync();
  } catch (e) {
    callback(e)
    return;
  }
  callback(null, v);
}

class ReduxLocalStorageAdapter {
  async put<T>(key: string, value: T, callback: (error: Error | null, v?: T) => void) {
    await storageImpl(() => storage.set(key, value), callback);
  }
  async get(key: string, callback: (error: Error | null, v?: any) => void) {
    await storageImpl(() => storage.get(key), callback);
  }
  async del(key: string, callback: (error: Error | null, v?: any) => void) {
    await storageImpl(() => storage.remove(key), callback);

  }
}

const adapter = new ReduxLocalStorageAdapter()

export default () => ({
  put: <T>(key: string, value: T, callback: (error: Error | null, v?: T) => void) => adapter.put(key, value, callback),
  get: <T>(key: string, callback: (error: Error | null, v?: T) => void) => adapter.get(key, callback),
  del: <T>(key: string, callback: (error: Error | null, v?: T) => void) => adapter.del(key, callback)
});