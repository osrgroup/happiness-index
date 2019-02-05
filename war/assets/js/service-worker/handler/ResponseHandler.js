import OperationService from "../db/OperationService";
import Gapi from "../util/gapi";
import Auth from "../util/auth";
import MessageHandler from "./MessageHandler";
import {MSG} from "../../common/SWCommunicator";

/**
 * Handles Good, Bad and Ugly Responses
 */
export default class ResponseHandler {
	constructor() {
	}

	static handleGoodAndBad(event, controller, shouldSync) {
		// Requests can only be used once, so clone them
		const request_0 = event.request;
		const request_1 = request_0.clone();
		return Gapi.getRequestData(request_0).then(function (data) {
			return fetch(request_1)
				.then(function (response) {
					return ResponseHandler.handleGoodResponse(response, event, controller.good, data);
				})
				.catch(function (error) {
					return ResponseHandler.handleBadResponse(controller.bad, data, shouldSync);
				});
		});
	}

	/**
	 * To be called when fetch succeded -> There is connection to the backend
	 * Calls the passed function that in most cases stores the values from the good response in the database
	 *
	 * @param response - The response from the request that should be handled
	 * @param event
	 * @param data - the data from the request
	 * @param handler - A function that processes the response, e.g. cache it in database.
	 *
	 * @returns {*} Returns the passed response
	 */
	static handleGoodResponse(response, event, handler, data) {
		if (!response) {
			console.debug('[SW] No response from fetch', event.request.url);
			return response;
		}
		const cloned_response = response.clone();
		if (handler !== undefined) {
			cloned_response.json().then(function (json) {
				handler(json, data);
			}).catch(function(){
				handler(null, data);
			});
		}
		return response;
	}

	/**
	 * To be called, when the fetch failed -> could not connect to backend
	 * Calls the passed function that in most cases queries the idb and returns the result
	 *
	 * @param handler - the handler method, the 'bad' method from the controller class
	 * @param data - The request data that should be stored in operations for sync, or null
	 * @param shouldSync - true if operation data should be stored in idb for later sync
	 */
	static handleBadResponse(handler, data, shouldSync) {
		console.log('[SW] Bad Response from fetch');
		return Auth.getCurrentUser().then(function (user) {
			//clone the data object, it may be modified
			//wont copy functions, but that's ok
			let copy_of_data = JSON.parse(JSON.stringify(data));
			return handler(copy_of_data).then(function (value) {
				if (shouldSync) {
					if(typeof value === 'object')
						data.ref = value;
					else if(value)
						data.ref = value.id;
					OperationService.put(data);
					MessageHandler.send_message_to_all_clients({evt: MSG.OPERATION.ADDED, args: [data]});
				}
				return new Response(JSON.stringify(value));
			});
		});
	}

}