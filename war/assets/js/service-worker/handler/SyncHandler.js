import MessageHandler from "./MessageHandler";
import {MSG} from "../../common/SWCommunicator";
import Gapi from "../util/gapi";
import OperationService from "../db/OperationService";
import {CodeService, TextDocumentService} from "../db/services";
import {ENDPOINT_IDS} from "../../common/endpoints/constants";
import {isEqual} from "lodash";
import DeepDiff from 'deep-diff';


export default class SyncHandler {
	constructor() {
	}

	/**
	 * Starts the sync
	 *
	 */
	static sync() {
		if (SyncHandler.syncing) {
			console.warn("no need to start sync, already syncing...");
			return;
		}
		SyncHandler.syncing = true;
		console.log("sync started");
		return SyncHandler._syncOpsRecursive().then(function () {
			console.log("sync finished");
			MessageHandler.send_message_to_all_clients({evt: MSG.SYNC.FINISHED.SUCCESS});
			SyncHandler.syncing = false;
		})
			.catch(function (error) {
				console.error(error);
				SyncHandler.syncing = false;
			});
	}


	/**
	 * Recursive method, gets operation by operation from operations store and executes them
	 * gradually
	 *
	 *
	 * @private
	 */
	static _syncOpsRecursive() {
		return OperationService.getFirstAndKey().then(function (keyval) {
			if (keyval === null) {
				// No operation left to sync
				return Promise.resolve();
			}
			const op = keyval.value;
			const key = keyval.key;
			return SyncHandler.checkForConflict(op, MSG.CONFLICT.NONE).then(function (conflict) {
				console.log("[SW] conflict resolution:", conflict)
				if (conflict === MSG.CONFLICT.THEIRS) {
					//we chose theirs, so jst remove the sync op and go on
					MessageHandler.send_message_to_all_clients({evt: MSG.OPERATION.REMOVED});
					return OperationService.dequeueOperation().then(function () {
						return SyncHandler._syncOpsRecursive();
					});
				}
				// TODO
				else if (conflict === MSG.CONFLICT.MERGE) {

				}
				// Now the conflict result should be either Mine or None,
				// which both results in just executing the operation
				if (SyncHandler._shouldRTCS(op)) {
					return SyncHandler._handleOpRTCS(key, op);
				}
				else {
					return SyncHandler._handleOpApi(op);
				}
			});
		});
	}

	/**
	 * Decides wether the operation should be executed through rtcs
	 */
	static _shouldRTCS(op) {
		switch (op.id) {
			case ENDPOINT_IDS.insertCode:
			case ENDPOINT_IDS.updateCode:
			case ENDPOINT_IDS.removeCode:
			case ENDPOINT_IDS.relocateCode:
				return true;
			case ENDPOINT_IDS.updateTextDocument:
				//an update of e.g the doc name is not a thing for rtcs, only if there are slate operations
				if (op.hasOwnProperty('operations'))
					return true;
			default:
				return false
		}
	}

	/**
	 * Send message to app to emit that op. Then go on with sync
	 */
	static _handleOpRTCS(key, op) {
		const msg = {
			evt: MSG.SYNC.RTCS,
			args: [key, op]
		};
		console.log("rtcs message to client", msg);
		return MessageHandler.send_message_to_first_client(msg).then(function (answer) {
			const operationId = answer.operationId;
			//wrap into Response
			const response = new Response(JSON.stringify(answer.resp));
			return SyncHandler._onSyncOpSuccessful(op, response).then(function () {
				MessageHandler.send_message_to_all_clients({evt: MSG.OPERATION.REMOVED});
				return OperationService.delete(operationId).then(function () {
					return SyncHandler._syncOpsRecursive();
				});
			});
		});

	}

	/**
	 *    Just execute op and go on with sync
	 */
	static _handleOpApi(op) {
		return Gapi.executeOperation(op).then(function (response) {
			console.log(response);
			if (response.ok) {
				return SyncHandler._onSyncOpSuccessful(op, response).then(function () {
					MessageHandler.send_message_to_all_clients({evt: MSG.OPERATION.REMOVED});
					return OperationService.dequeueOperation().then(function () {
						return SyncHandler._syncOpsRecursive();
					});
				});
			}
			else {
				return Promise.reject("Response is not ok");
			}
		}).catch(function (error) {
			// The fetch in execute Operation failed
			console.log(error);
		})
	}

	/**
	 *
	 * Operations to perform after an operation was synced, e.g updating the code ids with the new code id generated
	 * by the backend
	 *
	 *
	 *
	 * @private
	 */
	static _onSyncOpSuccessful(op, response) {
		switch (op.id) {
			case ENDPOINT_IDS.insertCode:
				return response.json().then(function (code) {
					return OperationService.updateOperationsWithCodes(op.ref, code);
				});
			default:
				return Promise.resolve();
		}
	}

	/**
	 * Compares the last state of the resource (saved in the idb resource_original store) when online
	 * with the current state in backend
	 *
	 * conflicts:
	 * remote | local
	 * Codes, Documents:
	 * update | update
	 * delete | update
	 * update | delete
	 *
	 * @param op
	 * @param lastAnswer the last answer form conflict gui. pass None the first time
	 */
	static checkForConflict(op, lastAnswer) {
		const ref = parseInt(op.ref);
		// console.log("[SW] checking for conflict for op", op, ref)
		/* There can only be a conflict, if the update refers to a resource that was available on server.
		* If id is negative, resource was created only locally
		*/
		if(ref < 0)
			return Promise.resolve(MSG.CONFLICT.NONE);
		switch (op.id) {
			case ENDPOINT_IDS.updateCode:
				console.log("[SW] potential conflict", op)
				return CodeService.getOriginal(op.ref).then(function (code_idb) {
					return Gapi.execute("qdacity.codes.getCode", {id: op.body.id}).then(function (response) {
						//TODO code_backend null (implement route as usual) or fail.
						/*TODO may compare op.body and backend for equal for properties of body
						 *  -> changes that were made remote and local when offline result in same resource-> no conflict?
						 */
						return response.json().then(function (code_backend) {
							return CodeService.putOriginal(code_backend).then(function () {
								return SyncHandler._compareAndCheckAgain(op, lastAnswer, code_backend, code_idb);
							})
						})
					})
				});
			case ENDPOINT_IDS.updateTextDocument:
				return TextDocumentService.getOriginal(op.ref).then(function (doc_idb) {
					return Gapi.execute(ENDPOINT_IDS.getTextDocument, {id: op.body.id}).then(function (response) {
						return response.json().then(function (doc_backend) {
							return TextDocumentService.putOriginal(doc_backend).then(function () {
								return SyncHandler._compareAndCheckAgain(op, lastAnswer, doc_backend, doc_idb);
							})
						})
					})
				});
			default:
				return Promise.resolve(MSG.CONFLICT.NONE);
		}

	}

	/**
	 * after conflict resolution, check again if conflict(backend changed)
	 * do that recursive until no conflict happens
	 */
	static _compareAndCheckAgain(op, last_answer, resource_backend, resource_idb) {
		const conflict = SyncHandler._compare(resource_backend, resource_idb);
		if (conflict) {
			console.log("[SW] there is a conflict. ", op, resource_idb, resource_backend);
			const diff = DeepDiff(resource_idb, resource_backend);
			return MessageHandler.send_message_to_first_client({
				evt: MSG.SYNC.CONFLICT,
				args: [op, op.body, resource_backend, diff]
			}).then(function (answer) {
				console.log("[SW] intermediate conflict res:", answer);
				return SyncHandler.checkForConflict(op, answer);
			})
		}
		else {
			return Promise.resolve(last_answer);
		}

	}

	/**
	 * Compares the resource from the backend with the resource stored in idb
	 *
	 * Return true if they differ
	 * @param obj_backend
	 * @param obj_idb
	 * @private
	 */
	static _compare(obj_backend, obj_idb) {
		console.log("[SW] comparing", obj_backend, obj_idb);
		return !isEqual(obj_backend, obj_idb);
		/*
		for (let [key, value] of Object.entries(obj_backend)) {
			if(!isEqual(value, obj_idb[key]))
				return true;
		}
		return false;
		*/
	}
}

SyncHandler.syncing = false;


