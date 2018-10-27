"use strict";
angular.module('gdo6').
controller('GDOTableCtrl', function($scope, GDORequestSrvc) {
	
	$scope.init = function(config) {
		console.log('GDOTableCtrl.init()', config);
		$scope.config = config;
		if ($scope.config.sortable) {
			if ($.draggable) {
				$scope.setupDragDrop($('.gdo-table tr'));
			} else {
				console.error('Anguler GDOTableCtrl sortable depends on missing JQueryUI module.');
			}
		}
	};
	
	$scope.onDrop = function(a, b) {
		console.log('GDOTableCtrl.onDrop()', a, b);
		var url = $scope.config.sortableURL;
		var data = {a:a.attr('gdo-id'),b:b.attr('gdo-id')};
		GDORequestSrvc.send(url, data).then(function(result) {
			// Successfully swapped positions.
			// Do alike in JS
			var a1 = a.prev(); var a2 = a.next(); // Prev and 
			var b1 = b.prev(); var b2 = b.next(); // Next row
			if (a1[0] == b[0]) { a1 = a1.prev(); }
			if (a2[0] == b[0]) { a2 = a2.next(); }
			if (b1[0] == a[0]) { b1 = b1.prev(); }
			if (b2[0] == a[0]) { b2 = b2.next(); }
			// Remove swappers
			a.remove(); b.remove();
			// Put in new places
			if (b2.length) {b2.before(a); } else {  b1.after(a); }
			if (a1.length) { a1.after(b); } else { a2.before(b); }
			// Restore clone
			$scope.setupDragDrop(a);
			$scope.setupDragDrop(b);
		});
	};
	
	$scope.setupDragDrop = function($elements) {
		setTimeout(function(){
			$elements.draggable({
				helper: 'clone',
			});
			$elements.droppable({
				drop: function(event, ui) {
					var a = $(ui.draggable);
					var b = $(event.target);
					$scope.onDrop(a, b);
				}
			});
		})
	};
	
});
