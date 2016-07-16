(function() {
	'use strict';
	var app = angular.module('app', [], function config($httpProvider) {
		$httpProvider.interceptors.push('AuthInterceptor');
	});

	app.constant('API_URL', 'http://localhost:3000');

	app.controller('MainCtrl', function(RandomUserFactory, UserFactory) {
		'use strict';
		var vm = this;
		vm.getRandomUser = getRandomUser;
		vm.login = login;
		vm.logout = logout;

		function login(username, password) {
			UserFactory.login(username, password).then(function success(res) {
				delete vm.errorMessage;
				vm.user = res.data.user;
				vm.token = res.data.token;
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

		function logout() {
			UserFactory.logout();
		}
	});

	app.factory('RandomUserFactory', function RandomUserFactory($http, API_URL) {
		'use strict';
		return {
			getUser: getUser,
		};

		function getUser() {
			return $http.get(API_URL + '/random-user');
		}
	});

	 app.factory('UserFactory', function UserFactory($http, API_URL, AuthTokenFactory) {
	 	'use strict';
	 	return {
	 		login: login,
	 		logout: logout,
	 	};

	 	function login(username, password) {
			console.log(username, password)			
	 		return $http.post(API_URL + '/login', {
	 			username: username,
	 			password: password
	 		}).then(function success(res) {
	 			AuthTokenFactory.setToken(res.data.token);

	 			return res;
	 		});
	 	}

	 	function logout() {
	 		AuthTokenFactory.setToken();
	 	}
	 });

	 app.factory('AuthTokenFactory', function AuthTokenFactory($window) {
	 	'use strict';
	 	var store = $window.localStorage;
	 	var key = 'auth-token';

	 	return {
	 		getToken: getToken,
	 		setToken: setToken,
	 	}

	 	function getToken() {
	 		return store.getItem(key)
	 	}

	 	function setToken(token) {
	 		if(token) {
	 			store.setItem(key, token);
	 		} else {
	 			store.removeItem(key);
	 		}
	 	}
	 });

	 app.factory('AuthInterceptor', function AuthInterceptor(AuthTokenFactory) {
	 	'use strict';
	 	return {
	 		request: addToken
	 	}

	 	function addToken(config) {
	 		var token = AuthTokenFactory.getToken();
	 		if(token) {
	 			config.headers = config.headers || {};
	 			config.headers.Authorization = 'Bearer ' + token;
	 		}
	 		return config;
	 	}
	 })
})();