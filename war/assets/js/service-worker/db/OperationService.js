import DB from "./DB";
import {STORE_NAMES} from "./constants";
import CrudService from "./CrudService";

/**
 * This module handles the Operations Table in the indexedDB
 * This store holds all operations that are triggered when offline and are stored for later sync
 *
 */
export default class OperationService extends CrudService {
	/**
	 *
	 * TODO: check if db can be altered between getallkeys and getall
	 *
	 * Retrieves all operations with the given reference id
	 *
	 *
	 * @param {String} id - The Ref id - e.g -652385441 or 65343422
	 * @param methods - a list of methods, e.g ["qdacity.codes.updateCode", "qdacity.codes.insertCode"]. optional
	 * @return {*}
	 */
	static getOperationsByRefId(id, methods = []) {
		return OperationService.getAllKeys().then(function (keys) {
			return OperationService.getAll().then(function (operations) {
				let result = [];
				for (let [index, operation] of operations.entries()) {
					if (operation.ref === id) {
						if (!methods.length || methods.includes(operation.id)) {
							result.push({key: keys[index], value: operation})
						}
					}
				}
				return result;
			});
		});
	}

	/**
	 * Deletes the first Operation in the Operation queue and returns it
	 *
	 * @return {Promise<any[]>}
	 */
	static dequeueOperation() {
		return OperationService.getAllKeys().then(function (items) {
			if (items.length === 0) {
				return Promise.reject("no operations left");
			}
			const key = items[0];
			return OperationService.get(key).then(function (value) {
				const operation = value;
				return OperationService.delete(key).then(function () {
					return operation;
				})
			})
		});
	}

	/**
	 *
	 * Updates all operations in the operation store with a new code, that depend on that code
	 *
	 * @param old_id
	 * @param code
	 * @return {*}
	 */
	static updateOperationsWithCodes(old_id, code) {
		return this.getOperationsByRefId(old_id, ["qdacity.codes.updateCode", "qdacity.codes.deleteCode"]).then(function (operations) {
			for (let operation of operations) {
				operation.value.body.id = code.id;
				operation.value.body.codeID = code.codeID;
				OperationService.putForKey(operation.key, operation.value);
			}
		});
	}
}
OperationService.STORE_NAME = STORE_NAMES.OPERATIONS.name;


