import SyncHandler from "./SyncHandler";
import {CodeService} from "../db/services";
import Gapi from "../util/gapi"
import {MSG} from "../../common/SWCommunicator";
import OperationService from "../db/OperationService";


export default class MessageHandler {
	constructor() {
	}

	/**
	 * TODO define constants for messages
	 * TODO check for valid message args
	 *
	 * Handles messages received from main Thread
	 *
	 * @param message
	 */
	static handleMessage(message) {
		const evt = message.evt;
		const args = message.args;
		switch (evt) {
			case MSG.TOKEN:
				const token = args[0];
				Gapi.token = token;
				// SyncHandler.sync();
				return Promise.resolve();
			case MSG.DO_SYNC:
				return SyncHandler.sync();
			case MSG.EMIT.SUCCESS:
				return Promise.resolve({
					operationId: args[0],
					resp: args[1],
				});
			case MSG.CODING.ADD:
				const id = args[0];
				const slate_operations = args[1];
				return OperationService.getAllKeys().then(function (keys) {
					const last_key = keys.pop();
					//Last operation should really be that updatetextdoc operation
					return OperationService.get(last_key).then(function (last_operation) {
						last_operation.operations = slate_operations;
						console.log("[SW] purring op for key", last_key);
						return OperationService.putForKey(last_key, last_operation);
					})
				});
			case MSG.CONFLICT.THEIRS:
			case MSG.CONFLICT.MINE:
				return evt;

			case "codeInserted":
			case "codeUpdated":
				return CodeService.put(args[0]);
		}
	}

	/**
	 *
	 * @param msg - The message to send
	 * @param msg.evt - The message event name
	 * @param msg.args - List of arguments
	 */
	static send_message_to_all_clients(msg) {
		self.clients.matchAll().then(clients => {
			clients.forEach(client => {
				MessageHandler.send_message_to_client(client, msg).then(m => console.log("SW Received Message: " + m));
			})
		});
	}

	/**
	 * Sends a message to the first client. Wait for answer from the client
	 * @param msg
	 * @return {Promise}
	 */
	static send_message_to_first_client(msg) {
		return self.clients.matchAll().then(clients => {
			return MessageHandler.send_message_to_client(clients[0], msg).then(function (message) {
				console.log("[SW] Received Answer:", message);
				return MessageHandler.handleMessage(message);
			});
		});
	}

	static send_message_to_client(client, msg) {
		return new Promise(function (resolve, reject) {
			var msg_chan = new MessageChannel();

			msg_chan.port1.onmessage = function (event) {
				if (event.data.error) {
					reject(event.data.error);
				} else {
					resolve(event.data);
				}
			};

			client.postMessage(msg, [msg_chan.port2]);
		});
	}
}


