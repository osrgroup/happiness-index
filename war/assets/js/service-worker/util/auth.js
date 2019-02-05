import Gapi from "./gapi";

export default class Auth {

	/**
	 *
	 * Gets the current user from the cache.
	 * The user gets in the cache, when a request to the api at getCurrentUser ist made
	 *
	 * @return {Promise<any>} - A pomise holding the current User
	 */
	static async getCurrentUser() {
		const path = await Gapi.getFullPath("qdacity.user.getCurrentUser");
		return caches.match(path).then(function (cache_response) {
			return cache_response.json()
		}).then(function (user) {
			if(user.hasOwnProperty('id')) {
				return user;
			}
			return Promise.reject("the requested object is not a valid user");
		});
	}
}