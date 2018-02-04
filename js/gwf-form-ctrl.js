"use strict";
angular.module('gdo6').
controller('GDOFormCtrl', function($scope, $rootScope) {
	$scope.init = function(formId) {
		console.log('GDOFormCtrl.init()', formId);
		setTimeout(function() {
			$(formId + ' input').on('change', $scope.changedForm.bind($scope, formId));
		}, 1);
	};
	$scope.changeTimeout = null;
	$scope.changedForm = function(formId, event) {
		console.log('GDOFormCtrl.changedForm()', formId, event);
		if ($scope.changeTimeout) {
			clearTimeout($scope.changeTimeout);
		}
		$scope.changeTimeout = setTimeout(function(){
			$rootScope.$broadcast('gdo-form-changed', formId, event);
		}, 700);
	};
}).controller('GDOTableToggleCtrl', function($scope){
	$scope.cbxToggleAll = function($event) {
		console.log('GDOTableToggleCtrl.cbxToggleAll()', $event);
	};
}).controller('GDOCKEditorCtrl', function($scope) {
}).controller('GDOSelectCtrl', function($scope) {
	$scope.init = function(config) {
		console.log('GDOSelectCtrl.init()', config);
		$scope.multiple = config.multiple;
		$scope.selection = config.selected;
	};
	$scope.multiValueSelected = function(selector) {
		console.log('GDOSelectCtrl.multiValueSelected()', selector, $scope.selection);
		var value = $scope.multiple ? JSON.stringify($scope.selection) : $scope.selection;
		$(selector).attr('value', value).change();
	};
	$scope.valueSelected = function(selector) {
		console.log('GDOSelectCtrl.valueSelected()', selector, $scope.selection);
		$(selector).attr('value', $scope.selection).change();
	};
}).controller('GDOSliderCtrl', function($scope) {
	$scope.init = function(id, rangeMode) {
		$scope.id = id;
		$scope.rangeMode = rangeMode;
		setTimeout(function(){
			$scope.$broadcast('rzSliderForceRender');
		},10)
	};
	$scope.$on("slideEnded", function(event) {
		var val = $scope.rangeMode ? JSON.stringify([$scope.slidervalue, $scope.sliderhigh]) : $scope.slidervalue;
		$($scope.id).val(val).change();
	});
}).controller('GDODatepickerCtrl', function($scope){
	$scope.init = function(config) {
		console.log('GDODatepickerCtrl.init()', config);
		$scope.config = config;
	};
	$scope.datePicked = function(selector) {
		console.log('GDOSelectCtrl.datePicked()', selector, $scope.pickDate);
		var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
		var value = (new Date($scope.pickDate - tzoffset)).toISOString().slice(0,-1).substr(0, 19).replace('T', ' ');
		$(selector).val(value).change();
	};
}).controller('GDOAutoCompleteCtrl', function($scope, $q, GDORequestSrvc) {
	$scope.init = function(gwfConfig, formId) {
		console.log('GDOAutoCompleteCtrl.init()', gwfConfig, formId);
		$scope.config = gwfConfig;
		$scope.formid = formId;
		$scope.selectedItem = gwfConfig.selected ? gwfConfig.selected.display : null;
	};
	$scope.objectSelected = function(item) {
		console.log('GDOAutoCompleteCtrl.objectSelected()', item);
//		$scope.selectedItem = item ? item.text : null;
//		$scope.data.searchText = item ? item.text : '';
		$($scope.formid).val(item ? item.id : '0').change();
	};
	$scope.query = function(searchText) {
		console.log('GDOAutoCompleteCtrl.query()', searchText);
		var defer = $q.defer();
		GDORequestSrvc.send($scope.config.completionHref, {query:searchText}, true).
			then($scope.querySuccess.bind($scope, defer), $scope.queryFailure.bind($scope, defer));
		return defer.promise;
	};
	$scope.querySuccess = function(defer, result) {
		console.log('GDOAutoCompleteCtrl.querySuccess()', result);
		defer.resolve(result.data);
	};
	$scope.queryFailure = function(defer, result) {
		console.log('GDOAutoCompleteCtrl.queryFailure()', result);
		defer.reject(result);
	};
});
