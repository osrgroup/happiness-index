importScripts(
	'https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js'
);


const VERSION = 1;
const CACHE_PREFIX = "happiness-index";
const CACHE_SUFFIX = "v1";
const CACHE_RUNTIME = "runtime";
const CACHE_PRECACHE = "precache";
export const CACHE_RUNTIME_NAME = `${CACHE_PREFIX}-${CACHE_RUNTIME}-${CACHE_SUFFIX}`;
export const CACHE_PRECACHE_NAME = `${CACHE_PREFIX}-${CACHE_PRECACHE}-${CACHE_SUFFIX}`;

console.log("[SW] Hello. Using SW Version ", VERSION);

/*workbox.setConfig({
	debug: false
});*/
workbox.core.setLogLevel(workbox.core.LOG_LEVELS.silent); //workbox.core.LOG_LEVELS.debug


/**
 * Cache naming scheme.
 * results in runtime cache name: qdacity-app-runtime-v1
 */
workbox.core.setCacheNameDetails({
	prefix: CACHE_PREFIX,
	suffix: CACHE_SUFFIX,
	precache: CACHE_PRECACHE,
	runtime: CACHE_RUNTIME
});


workbox.skipWaiting();
workbox.clientsClaim();


//TODO precache instead of runtime

console.log("[SW] registering static routes");
workbox.routing.registerRoute(/.*\.css/, workbox.strategies.networkFirst());
workbox.routing.registerRoute(/.*\.js/, workbox.strategies.networkFirst());
workbox.routing.registerRoute(/.*\.cache\..*/, workbox.strategies.cacheFirst());
workbox.routing.registerRoute('/', workbox.strategies.networkFirst());
workbox.routing.registerRoute(
	'/PersonalDashboard',
	workbox.strategies.networkFirst()
);
workbox.routing.registerRoute(
	/ProjectDashboard.*/,
	workbox.strategies.networkFirst()
);
workbox.routing.registerRoute(
	/CodingEditor.*/,
	workbox.strategies.networkFirst()
);

workbox.routing.registerRoute(
	/_ah\/api\/static\/.*/,
	workbox.strategies.networkFirst()
);

