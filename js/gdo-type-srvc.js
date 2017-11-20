"use strict";
/**
 * Cache proxy for GDO/Core/Method/GetTypes
 */
angular.module('gdo6').
service('GDOTypeSrvc', function($q, GDORequestSrvc) {
	
	var TypeSrvc = this;

	TypeSrvc.FIELDS = null;
	TypeSrvc.TYPES = null;
	
	TypeSrvc.withTypes = function() {
		console.log('TypeSrvc.init()');
		if (TypeSrvc.FIELDS) {
			var defer = $q.defer();
			defer.resolve();
			return defer.promise;
		} else {
			return RequestSrvc.sendGWF('Core', 'GetTypes').then(TypeSrvc.gotTypes);
		}
	};
	
	TypeSrvc.withType = function(classname) {
		var defer = $q.defer();
		return TypeSrvc.withTypes().then(function(){
			if (TypeSrvc.FIELDS[classname]) {
				var fields = TypeSrvc.FIELDS[classname];
				defer.resolve();
				return fields;
			} else {
				defer.reject();
			}
		}, function(){
			defer.reject();
		});
		return defer.promise;
	};


	TypeSrvc.gotTypes = function(response) {
		console.log('TypeSrvc.gotTypes()', response);
		TypeSrvc.FIELDS = response.data.fields;
		TypeSrvc.TYPES = response.data.types;
		return response;
	};
	
	return TypeSrvc;
});
