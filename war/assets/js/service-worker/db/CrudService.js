import DB from "./DB";
import {ORIGINAL_SUFFIX} from "./constants";

export default class CrudService {
	static get(id) {
		return DB.get(this.STORE_NAME, id);
	}

	static getFirst() {
		return DB.getFirst(this.STORE_NAME)
	}

	static getFirstAndKey() {
		return DB.getFirstAndKey(this.STORE_NAME);
	}

	static put(item) {
		if (item === undefined)
			return Promise.resolve();
		return DB.put(this.STORE_NAME, item);
	}

	static add(item) {
		return DB.add(this.STORE_NAME, item);
	}

	static putForKey(key, value) {
		return DB.putForKey(this.STORE_NAME, value, key);
	}

	static getAll() {
		return DB.getAll(this.STORE_NAME);
	}

	static getAllKeys() {
		return DB.getAllKeys(this.STORE_NAME);
	}

	static putAll(items) {
		if (items === undefined)
			return Promise.resolve();
		return DB.putAll(this.STORE_NAME, items);
	}

	static delete(key) {
		return DB.delete(this.STORE_NAME, key)
	}

	/* Originals */

	static addOriginal(item) {
		return DB.add(this.STORE_NAME + ORIGINAL_SUFFIX, item);
	}

	static getOriginal(key) {
		return DB.get(this.STORE_NAME + ORIGINAL_SUFFIX, key);
	}

	static putOriginal(value) {
		return DB.put(this.STORE_NAME + ORIGINAL_SUFFIX, value);
	}

	static putForKeyOriginal(key, value) {
		return DB.putForKey(this.STORE_NAME + ORIGINAL_SUFFIX, value, key);
	}
}

/**
 * @abstract
 * Needs to be set in every subclass
 **/
CrudService.STORE_NAME = null;