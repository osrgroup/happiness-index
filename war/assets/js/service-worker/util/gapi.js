const _API_VERSION = '$API_VERSION$';
const _API = `_ah/api/discovery/v1/apis/qdacity/${_API_VERSION}/rest`;


export default class Gapi {
	constructor() {
	}

	static sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	/**
	 *
	 * @return {Promise<Response>}
	 */
	static discover() {
		Gapi.discovering = true;
		console.log("[SW] started discovering api");
		return fetch(_API)
			.then(function (response) {
				if (response.ok) {
					return response.json();
				}
			})
			.then(function (discovery) {
				Gapi._parseDiscovery(discovery);
				Gapi.ready = true;
				Gapi.discovering = false;
				console.log("[SW] finished discovering api");
			})
			.catch(function (error) {
				console.log('error discovery ', error);
				console.log("trying to get discovery from cache...");
				return caches.match(_API).then(function (cache_response) {
					console.log("found discovery in cache", cache_response);
					return cache_response.json()
				}).then(function (discovery) {
					Gapi._parseDiscovery(discovery);
					Gapi.ready = true;
					Gapi.discovering = false;
					console.log("[SW] finished discovering api");
				})
			});
	}


	/**
	 * Discovers the api, but only if not already discoverd or currently discovering
	 * @return {*}
	 */
	static async discoverSoftly() {
		if (!this.ready && !this.discovering) {
			return this.discover();
		}
		while (!this.ready) {
			await this.sleep(100);
		}
		return Promise.resolve();
	}

	/**
	 *
	 * @param discovery - Json represeting the discovery file
	 */
	static _parseDiscovery(discovery) {
		console.log('parsing discovery');
		Gapi.basePath = discovery.basePath;
		Gapi.baseUrl = discovery.baseUrl;
		const resources = discovery.resources;
		for (let resource in resources) {
			resource = resources[resource];
			for (let method in resource.methods) {
				method = resource.methods[method];
				Gapi.api[method.id] = method;
			}
		}
	}

	/**
	 *
	 * Returns the full Path(relative to the origin) of a given method
	 * without leading slash
	 *
	 * E.g given qdacity.codes.insertCode
	 * returns _ah/api/qdacity/v17/code/{parentId}
	 *
	 * @param id - the api id of the method
	 * @return {Promise<String>}
	 */
	static async getFullPath(id) {
		await Gapi.discoverSoftly();
		return (this.basePath + this.api[id].path).replace(/^\/+/g, '');
	}

	/**
	 *
	 * Converts the path of an api method given by its id
	 * to a regular expression
	 * @param id - the api id of the method
	 * @return {Promise<RegExp>}
	 */
	static async getRegex(id) {
		const path = await this.getFullPath(id);
		return new RegExp(path.replace(/{\w+}/g, "\\w+") + "(\\?.*)?$");
	}

	/**
	 *
	 * @param id - The id of the method to be executed, e.g. "qdacity.codes.insertCode'
	 * @param params - On object of params, e.g. {parentId: 1, relationId: 5}
	 * @param body - the request body, e.g. a code. may be undefined
	 * @return {Promise<Response>}
	 */
	static async execute(id, params, body) {
		await Gapi.discoverSoftly();
		const method = Gapi.api[id];
		const url = this._buildUrl(method, params);
		const init = {
			body: JSON.stringify(body),
			method: method.httpMethod,
			mode: "cors",
			headers: {
				'Authorization': this.token
			}
		};
		return fetch(url, init);

	}

	/**
	 *
	 * @param operation
	 * @return {Promise<Response>}
	 */
	static executeOperation(operation) {
		return this.execute(operation.id, operation.params, operation.body);
	}


	/**
	 * Converts an actual request with an url like http://a.de/api/code/1?arg=v
	 * to an object in the form
	 * {id, params, body} based on the current discovered api
	 * @param request - The request to convert
	 * @return {Promise} - A promise holding the data
	 */

	static async getRequestData(request) {
		await Gapi.discoverSoftly();
		const url = request.url;
		const httpMethod = request.method;

		const path = url.split('?')[0];
		for (let methodKey in this.api) {
			const method = this.api[methodKey];
			const regex = await this.getRegex(method.id);
			if (regex.test(path)) {
				if (httpMethod === method.httpMethod) {
					//found a matching method in api for the given url
					let params = {}, result;
					//1. get all path variables

					if (method.parameters !== undefined) {
						const stripped = path.replace(this.baseUrl, '');
						const split_actual = stripped.split("/");
						const split_skelet = method.path.split("/");
						for (let [index, val] of split_actual.entries()) {
							const skelet_key = split_skelet[index];
							const matches = skelet_key.match(/\{(.*?)\}/);
							if (matches !== null) {
								//variable found
								const key = matches[1];
								params[key] = val;
							}
						}

						//2. get query params
						let url_url = new URL(url);
						for (let param of url_url.searchParams.entries()) {
							if (param[0] in method.parameters) {
								//query param found
								params[param[0]] = param[1]
							}
						}
					}

					//3. get the body and return the data
					return request.json()
						.then(function (body) {
							return {
								id: method.id,
								params: params,
								body: body
							};
						})
						.catch(function (error) {
							return {
								id: method.id,
								params: params,
								body: undefined
							};
						});
				}
			}
		}

	}

	/**
	 *
	 * Builds an actual url based on the api method and the given params
	 *
	 * @param method
	 * @param params
	 * @return {string}
	 * @private
	 */
	static _buildUrl(method, params) {
		let path = Gapi.baseUrl + method.path;
		const parameters = method.parameters;

		//set path params
		for (let param in parameters) {
			if (parameters[param].location === "path") {
				path = path.replace(new RegExp("\{" + param + "\}", "g"), params[param]);
			}
		}

		//set query params
		let url = new URL(path);
		for (let param in parameters) {
			if (params[param] !== undefined) {
				if (parameters[param].location === "query") {
					url.searchParams.set(param, params[param]);
				}
			}
		}
		return url.toString();
	}

}

Gapi.ready = false;
Gapi.discovering = false;
Gapi.api = [];
Gapi.basePath = "";
Gapi.baseUrl = "";

