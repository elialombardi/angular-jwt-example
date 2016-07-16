(function() {
	'use strict';
	var app = angular.module('app', []);

	app.constant('API_URL', 'http://localhost:3000');

	app.controller('MainCtrl', function(RandomUserFactory, UserFactory) {
		'use strict';
		var vm = this;
		vm.getRandomUser = getRandomUser;
		vm.login = login;

		function login(username, password) {
			UserFactory.login(username, password).then(function success(res) {
				delete vm.errorMessage;
				vm.user = res.data;
			}, errorHandler);
		}

		function errorHandler(response) {
			vm.errorMessage='Error: ' + response.data;
		}

		function getRandomUser() {
			RandomUserFactory.getUser().then(function success(res) {
				vm.randomUser = res.data;
			});
		}
	});

	app.factory('RandomUserFactory', function RandomUserFactory($http, API_URL) {
		'use strict';
		return {
			getUser: getUser
		};

		function getUser() {
			return $http.get(API_URL + '/random-user');
		}
	});

	 app.factory('UserFactory', function UserFactory($http, API_URL) {
	 	'use strict';
	 	return {
	 		login: login
	 	};

	 	function login(username, password) {
			console.log(username, password)			
	 		return $http.post(API_URL + '/login', {
	 			username: username,
	 			password: password
	 		});
	 	}
	 })
})();