const dbName = "rrmsdb";
let request: IDBOpenDBRequest;
let db: IDBDatabase;
let version = 1;

export enum Stores {
  ViewedListings = "viewedListings",
}

export const initDB = (store: Stores): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // open the connection
    request = indexedDB.open(dbName, version);

    request.onupgradeneeded = () => {
      db = request.result;

      // if the data object store doesn't exist, create it
      if (!db.objectStoreNames.contains(store)) {
        db.createObjectStore(store, { keyPath: "id" });
      }
      // no need to resolve here
    };

    request.onsuccess = () => {
      db = request.result;
      version = db.version;
      console.log("request.onsuccess - initDB", version);
      resolve(true);
    };

    request.onerror = (e) => {
      reject(request.error?.message);
    };
  });
};

export const addData = <T>(
  storeName: string,
  data: T,
): Promise<T | string | null> => {
  return new Promise((resolve, reject) => {
    request = indexedDB.open(dbName, version);

    request.onsuccess = () => {
      console.log("request.onsuccess - addData", data);
      db = request.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      store.add(data);
      resolve(data);
    };

    request.onerror = () => {
      reject(request.error?.message);
    };
  });
};

export const getStoreData = <T>(storeName: Stores): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    request = indexedDB.open(dbName);

    request.onsuccess = () => {
      console.log("request.onsuccess - getAllData");
      db = request.result;
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const res = store.getAll();
      res.onsuccess = () => {
        resolve(res.result);
      };
      res.onerror = () => {
        reject(res.error?.message);
      };
    };

    request.onerror = () => {
      reject(request.error?.message);
    };
  });
};

export const deleteData = (
  storeName: string,
  key: string,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // again open the connection
    request = indexedDB.open("myDB", version);

    request.onsuccess = () => {
      console.log("request.onsuccess - deleteData", key);
      db = request.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const res = store.delete(key);

      // add listeners that will resolve the Promise
      res.onsuccess = () => {
        resolve(true);
      };
      res.onerror = () => {
        reject(res.error?.message);
      };
    };

    request.onerror = (e) => {
      reject(request.error?.message);
    };
  });
};
