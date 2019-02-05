import IntlProvider from '../Localization/LocalizationProvider';
import { DialogProvider } from 'modals/DialogProvider.jsx';

export default class Promisizer {
	constructor() {}

	static makePromise(apiMethod) {
		var promise = new Promise(function(resolve, reject) {
			apiMethod.execute(function(resp) {
				if (!resp.code) {
					resolve(resp);
				} else {
					const method = Promisizer.getMethod(apiMethod);
					if (
						resp.code === -1 &&
						(method === 'POST' || method === 'DELETE' || method === 'PUT')
					) {
						if (!Promisizer.isExcluded(apiMethod)) {
							const { formatMessage } = IntlProvider.intl;
							const alertMessage = formatMessage({
								id: 'modal.offline_unsupported',
								defaultMessage:
									'Operation currently not supported in offline mode'
							});
							DialogProvider.staticNotification(alertMessage);
						}
					}
					reject(resp);
				}
			});
		});
		return promise;
	}

	/**
	 *
	 * Define methods that should not trigger an alert message if failed
	 *
	 * Maybe change alert message to whitelist instead of blacklisting excluded methods
	 *
	 * @param apiMethod - The api method
	 * @return {*} - True if method should be excluded, false otherwise
	 */
	static isExcluded(apiMethod) {
		return apiMethod.Zq.k5.path.includes("refreshToken");
	}

	/**
	 * Retrieves the http method from a Google api object
	 * TODO try to get method without cryptic attributes if possible
	 * @param apiMethod
	 * @return {String}
	 */
	static getMethod(apiMethod) {
		return apiMethod.Zq.k5.method;
	}
}
