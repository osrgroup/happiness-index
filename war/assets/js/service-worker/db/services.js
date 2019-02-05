import {STORE_NAMES} from "./constants";
import CrudService from "./CrudService";

export class CodeService extends CrudService {
	static getCode(codeID, codesystemID) {
		return CodeService.getAll().then(function(codes){
			const found = codes.filter(code => code.codesystemID === codesystemID && code.codeID === codeID);
			if(found.length > 0) {
				return found[0];
			}
			return null;
		}) ;
	}
}

export class MetaModelEntityService extends CrudService {}

export class MetaModelRelationService extends CrudService {}

export class ProjectService extends CrudService {}

export class ValidationProjectService extends CrudService {}

export class UmlCodePositionService extends CrudService {}

export class TextDocumentService extends CrudService {}

CodeService.STORE_NAME = STORE_NAMES.CODES.name;
MetaModelEntityService.STORE_NAME = STORE_NAMES.METAMODEL_ENTITY.name;
MetaModelRelationService.STORE_NAME = STORE_NAMES.METAMODEL_RELATION.name;
ProjectService.STORE_NAME = STORE_NAMES.PROJECTS.name;
ValidationProjectService.STORE_NAME = STORE_NAMES.VALIDATION_PROJECTS.name;
UmlCodePositionService.STORE_NAME = STORE_NAMES.UML_CODE_POSITIONS.name;
TextDocumentService.STORE_NAME = STORE_NAMES.DOCUMENTS.name;
