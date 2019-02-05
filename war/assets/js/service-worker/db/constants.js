/**
 *    This module defines the stores the should be created
 *
 * IMPORTANT: Upgrade the DB_VERSION when new stores are defined
 */

export const DB_VERSION = 13;

export const ORIGINAL_SUFFIX = "_ORIGINAL";

/**
 * The options are the actual idb store options
 *
 * When createCopy is true, a copy of that store with suffixed name will be created. Remember to upgrade DB_VERSION then
 *
 */
export const STORE_NAMES = {
	/**
	 *
	 *    {
	 * 		body, //body of the request
	 *		id, //id of the method, eg qdacity.code.insertCode
	 *		params, // named parameters of the request
	 *		ref // reference of the object operated upon (eg. for codes the preliminary negative database ID), set in ResponseHandler.handleBadResponse
	 * 	}
	 **/
	OPERATIONS: {
		name: "operations",
		options: {
			autoIncrement: true
		}
	},
	DOCUMENTS: {
		name: "documents",
		options: {
			keyPath: "id"
		},
		createCopy: true
	},
	CODES: {
		name: "codes",
		options: {
			keyPath: "id"
		},
		createCopy: true
	},
	PROJECTS: {
		name: "projects",
		options: {
			keyPath: "id"
		},
		createCopy: true
	},
	VALIDATION_PROJECTS: {
		name: "validationProjects",
		options: {
			keyPath: "id"
		},
		createCopy: true
	},
	METAMODEL_ENTITY: {
		name: "metamodelEntities",
		options: {
			keyPath: "id"
		}
	},
	METAMODEL_RELATION: {
		name: "metamodelRelations",
		options: {
			keyPath: "id"
		}
	},
	UML_CODE_POSITIONS: {
		name: "umlCodePositions",
		options: {
			keyPath: "id"
		}
	},
};
