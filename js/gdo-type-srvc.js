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
	
	/**
	 * Fill a gdo by parsing a binary websocket message.
	 */
	TypeSrvc.parseBinaryGDO = function(gwsMessage, classname, gdo) {
//		return TypeSrvc.withType(classname).then(function(fields) {
			var fields = TypeSrvc.FIELDS[classname];
			console.log('TypeSrvc.parseBinaryGDO()', fields);
			for (var key in fields) {
				var field = fields[key];
				if (TypeSrvc.isTypeSubmitted(field)) {
					var value = TypeSrvc.parseBinaryTypeHierarchy(gwsMessage, field);
					if (value === undefined) {
						console.error('TypeSrvc.parseBinaryType: Cannot convert '+key+' which is a '+field.type);
					} else {
						console.log("SET", key, value);
						gdo.JSON[key] = value;
					}
				}
			}
//		}, function(err) {
//			alert(classname);
//			console.log(TypeSrvc.FIELDS);
//		});
	};
	
	/**
	 * Filter some gdt that are not transmitted.
	 * passwords and secrets.
	 */
	TypeSrvc.isTypeSubmitted = function(field) {
		switch (field.type) {
		case 'GDO\\User\\GDT_Password':
//		case 'GDO\\User\\GDT_Secret':
		case 'GDO\\Net\\GDT_IP':
			return false;
		}
		return true;
	};
	
	/**
	 * Parse a portion of a binary websocket message.
	 * The parsing is determined by the gdt type and its options.
	 * The type and options meta data is retrieved by Core/GetTypes and Core/GetEnums
	 * The parsing target format is the json equivalent of a response.
	 */
	TypeSrvc.parseBinaryTypeHierarchy = function(gwsMessage, field) {
		var options = field.options; // field options
		var gdtType = field.type; // field type
		var hierarc = TypeSrvc.TYPES[gdtType]; // Class hierarchy
		console.log('PARSE', gdtType, options, hierarc);
		var value = TypeSrvc.parseBinaryType(gdtType, gwsMessage, gdtType, options);
		if (value === undefined) {
			for (var i in hierarc) {
				value = TypeSrvc.parseBinaryType(hierarc[i], gwsMessage, gdtType, options);
				if (value !== undefined) {
					break;
				}
			}
		}
		return value;
	};
	
	TypeSrvc.parseBinaryType = function(klass, gwsMessage, gdtType, options) {
		switch (klass) {
		case 'GDO\\Core\\GDT_JSON': var s = gwsMessage.readString(); console.log(s); return JSON.parse(s);
		case 'GDO\\Date\\GDT_Timestamp': var t = gwsMessage.read32(); return t > 0 ? new Date(t*1000).toISOString() : null;
		case 'GDO\\DB\\GDT_Decimal':
		case 'GDO\\DB\\GDT_Float':
			return gwsMessage.readFloat();
		case 'GDO\\DB\\GDT_Int': return gwsMessage.readN(options.bytes);
		case 'GDO\\DB\\GDT_String': return gwsMessage.readString();
		case 'GDO\\DB\\GDT_Enum': var integer = gwsMessage.read8(); return integer === 0 ? null : options.enumValues[integer-1];
		case 'GDO\\Maps\\GDT_Position': return [gwsMessage.readFloat(), gwsMessage.readFloat()];
		}
	};
	
	return TypeSrvc;
});
