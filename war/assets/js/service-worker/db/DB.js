import idb from 'idb';
import {DB_VERSION, ORIGINAL_SUFFIX, STORE_NAMES} from "./constants";
import Auth from "../util/auth";

/**
 * Class for opening a specific database or database for current user
 * Provides methods, for reading and writing to the database.
 * Uses indexedDB with promises:
 * https://github.com/jakearchibald/idb
 */
export default class DB {
	constructor() {
	}


	/**
	 *
	 * Opens the database specified by the user id.
	 * Creates the stores if they do not exist already
	 *
	 * @param userId - the userId, which will be used as database name
	 * @returns {Promise<DB>}
	 * @private
	 */
	static _openDB(userId) {
		return idb.open(userId, DB_VERSION, function (upgradeDB) {
			for (let storeKey in STORE_NAMES) {
				let store = STORE_NAMES[storeKey];
				if (!upgradeDB.objectStoreNames.contains(store.name)) {
					upgradeDB.createObjectStore(store.name, store.options);
				}
				if (store.createCopy) {
					const store_name_original = store.name + ORIGINAL_SUFFIX;
					if (!upgradeDB.objectStoreNames.contains(store_name_original)) {
						upgradeDB.createObjectStore(store_name_original, store.options);
					}
				}
			}
		});
	}

	/**
	 * Opens a indexedDB. It is specified by the lastest user's qdacity id(which is stored in the cache . e.g
	 * c98799d1-ca30-42ab-a29e-4317624c6a99)
	 *
	 * @return {Promise<DB | never>}
	 * @private
	 */
	static _openDBCurrentUser() {
		return Auth.getCurrentUser().then(function (user) {
			return DB._openDB(user.id);
		});
	}

	/**
	 * Inserts or updates one or more items in the specified store
	 *
	 *
	 * When an item with the key already exists, it will be overwritten
	 * @param store_name
	 * @param items
	 * @return {Promise<void | never>}
	 */
	static put(store_name, ...items) {
		return DB._openDBCurrentUser().then(function (db) {
			const tx = db.transaction(store_name, 'readwrite');
			const store = tx.objectStore(store_name);
			for (let item of items) {
				store.put(item);
			}
			return tx.complete;
		});
	}

	static add(store_name, item) {
		return DB._openDBCurrentUser().then(function (db) {
			const tx = db.transaction(store_name, 'readwrite');
			const store = tx.objectStore(store_name);
			store.add(item).catch(function (error) {
				console.warn("item already added");
			});
			return tx.complete.catch(function (error) {
				console.warn("add tx not completetd. probably item already added");
				return Promise.resolve()

			});
		});
	}

	static delete(store_name, ...keys) {
		return DB._openDBCurrentUser().then(function (db) {
			const tx = db.transaction(store_name, 'readwrite');
			const store = tx.objectStore(store_name);
			for (let key of keys) {
				store.delete(key);
			}
			return tx.complete;
		});
	}

	/**
	 * Updates an item in the store, specified be the key.
	 * The item itself probably holds a new key or is an item holding no key (auto incremented)
	 *
	 * @param store_name
	 * @param item
	 * @param old_key
	 * @return {Promise<void | never>}
	 */
	static putForKey(store_name, item, old_key) {
		return DB._openDBCurrentUser().then(function (db) {
			const tx = db.transaction(store_name, 'readwrite');
			const store = tx.objectStore(store_name);
			store.put(item, old_key);
			return tx.complete;
		});
	}

	/**
	 * Insert on or more lists of items in the store
	 *
	 * @param store_name
	 * @param items: a list of lists of items
	 * @return {*}
	 */
	static putAll(store_name, ...items) {
		return DB._openDBCurrentUser().then(function (db) {
			const tx = db.transaction(store_name, 'readwrite');
			const store = tx.objectStore(store_name);
			for (let item of items) {
				for (let real_item of item) {
					store.put(real_item);
				}
			}
			return tx.complete;
		});
	}

	/**
	 * Retrieves an item from the store specified by its key
	 *
	 * @param store_name
	 * @param id
	 * @return {Promise<DB | never | never>}
	 */
	static get(store_name, id) {
		return DB._openDBCurrentUser().then(function (db) {
			const tx = db.transaction(store_name, 'readonly');
			const store = tx.objectStore(store_name);
			return store.get(id);
		});
	}

	/**
	 * Retrieves the first item in the store with its key
	 *
	 */
	static getFirstAndKey(store_name) {
		return DB._openDBCurrentUser().then(function (db) {
			const tx = db.transaction(store_name, 'readonly');
			const store = tx.objectStore(store_name);
			return store.getAllKeys().then(function (items) {
				if (items.length === 0) {
					return null;
				}
				const key = items[0];
				return store.get(key).then(function (value) {
					return {key: key, value: value};
				})
			});
		});
	}

	/**
	 *
	 */
	static getFirst(store_name) {
		return this.getFirstAndKey(store_name).then(function (first) {
			return first.value;
		});
	}

	/**
	 * Retrieves all items from the store
	 *
	 * @param store_name
	 * @return {Promise<any[] | never>}
	 */
	static getAll(store_name) {
		return DB._openDBCurrentUser().then(function (db) {
			const tx = db.transaction(store_name, 'readonly');
			const store = tx.objectStore(store_name);
			return store.getAll();
		});
	}

	static getAllKeys(store_name) {
		return DB._openDBCurrentUser().then(function (db) {
			const tx = db.transaction(store_name, 'readonly');
			const store = tx.objectStore(store_name);
			return store.getAllKeys();
		});
	}
}
