fileItApp.service('LoadingService', function($rootScope) {
	this.showLoad = function() {
		$('#loadingScreen').addClass('display-flex');
		$('#loadingScreen').removeClass('display-none');
	};
	this.hideLoad = function() {
		$('#loadingScreen').removeClass('display-flex');
		$('#loadingScreen').addClass('display-none');
	};
});

// Service for REST API Call
fileItApp.factory('RestSvc', [
		'$http',
		'$q',
		'FILEIT_CONFIG',
		'LoadingService',
		function($http, $q, FILEIT_CONFIG, LoadingService) {
			return {

				getData : function(relURL) {
					LoadingService.showLoad();
					var appGetUrl = FILEIT_CONFIG.apiUrl + relURL;
					return $http.get(appGetUrl).then(function(response) {
						console.log('Success : ' + response.status);
						return response;
					}, function(error) {
						console.log('Error : ' + error.status);
						return $q.reject(error.data);
					})['finally'](function() {
						LoadingService.hideLoad();
					});
				},

				postData : function(relURL, data) {
					LoadingService.showLoad();
					var appPostUrl = FILEIT_CONFIG.apiUrl + relURL;
					return $http.post(appPostUrl, data).then(
							function(response) {
								console.log('Success : ' + response.status);
								return response;
							}, function(error) {
								console.log('Error : ' + error.status);
								return $q.reject(error.data);
							})['finally'](function() {
						LoadingService.hideLoad();
					});
				},

				getDataWithParams : function(relURL, data) {
					LoadingService.showLoad();
					var appGetUrl = FILEIT_CONFIG.apiUrl + relURL + data;
					return $http.get(appGetUrl).then(function(response) {
						console.log('Success : ' + response.status);
						return response;
					}, function(error) {
						console.log('Error : ' + error.status);
						return $q.reject(error.data);
					})['finally'](function() {
						LoadingService.hideLoad();
					});
				}
			};
		} ]);

fileItApp
		.factory(
				'authInterceptor',
				function($rootScope, $q, $sessionStorage) {
					return {
						request : function(config) {
							config.headers = config.headers || {};

							if (config.url.includes == undefined) {

								if (/authenticate/.test(config.url)) {
									config.headers = {
										'Content-type' : 'application/x-www-form-urlencoded',
										'Authorization' : $sessionStorage.authData
									};

									delete $sessionStorage.authData;

								} else if ($sessionStorage.token) {

									config.headers = {
										'Accept' : 'application/json',
										'Content-type' : 'application/json'
									};

									if (/getPdf/.test(config.url)) {
										config.headers = {
											'Accept' : 'application/pdf',
										};
										config.responseType = 'arraybuffer';
									}

									config.headers.Authorization = 'Bearer '
											+ $sessionStorage.token;
								} else {
									config.headers = {
										'Accept' : 'application/json',
										'Content-type' : 'application/json'
									};
								}

							} else {
								if (config.url.includes('authenticate')) {
									config.headers = {
										'Content-type' : 'application/x-www-form-urlencoded',
										'Authorization' : $sessionStorage.authData
									};

									delete $sessionStorage.authData;

								} else if ($sessionStorage.token) {
									config.headers = {
										'Accept' : 'application/json',
										'Content-type' : 'application/json'
									};

									if (config.url.includes('getPdf')) {
										config.headers.Accept = 'application/pdf';
										config.responseType = 'arraybuffer';
									}

									config.headers.Authorization = 'Bearer '
											+ $sessionStorage.token;
								} else {
									config.headers = {
										'Accept' : 'application/json',
										'Content-type' : 'application/json'
									};
								}
							}

							console.log(config);
							return config;
						},

						requestError : function(rejection) {

							console.log('Request Error - ' + rejection.status);
							console.log(rejection.data);
							console.log(rejection.statusText);
							return $q.reject(rejection);
						},

						responseError : function(rejection) {

							var rejectionData;

							if (rejection.status == 0) {
								rejectionData = 888;
							} else if (rejection.status == 401) {
								if (rejection.data.AuthenticationDetails.ErrorMessage == "Password Expired") {
									$('#chngePwdModal').modal('show');
								} else {
									rejectionData = rejection.data.AuthenticationDetails.ErrorMessage;
								}
							} else {

								if (rejection.data.BusinessError != undefined) {
									rejectionData = rejection.data.BusinessError.Code;
								} else {
									rejectionData = 888;
								}

							}

							console.log('Rejection Status : ' + rejectionData);

							if (rejectionData != undefined) {
								$rootScope.$broadcast('ErrorData', {
									errStatus : rejectionData
								});

							}
							return $q.reject(rejection);
						}
					};
				});

fileItApp.config(function($httpProvider) {
	$httpProvider.interceptors.push('authInterceptor');
});

fileItApp
		.service(
				'EncoderSvc',
				function() {
					this.encodeData = function(s) {

						var base64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
								.split("");

						var r = "";
						var p = "";
						var c = s.length % 3;

						if (c > 0) {
							for (; c < 3; c++) {
								p += '=';
								s += "\0";
							}
						}

						for (c = 0; c < s.length; c += 3) {
							if (c > 0 && (c / 3 * 4) % 76 == 0) {
								r += "\r\n";
							}

							var n = (s.charCodeAt(c) << 16)
									+ (s.charCodeAt(c + 1) << 8)
									+ s.charCodeAt(c + 2);

							n = [ (n >>> 18) & 63, (n >>> 12) & 63,
									(n >>> 6) & 63, n & 63 ];

							r += base64chars[n[0]] + base64chars[n[1]]
									+ base64chars[n[2]] + base64chars[n[3]];
						}
						return r.substring(0, r.length - p.length) + p;
					};
				});

fileItApp.service('AesEncoder', function() {
	this.encodeData = function(data) {
		var iv = "00000000000000000000000000000000";
		var salt = "00000000000000000000000000000000";
		var keySize = 128;
		var iterationCount = 10000;
		var passPhrase = "aesalgoforpos";
		var aesUtil = new AesUtil(keySize, iterationCount);
		var encrypt = aesUtil.encrypt(salt, iv, passPhrase, data);
		return encrypt;
	};
});

fileItApp.factory('CURR_DATE_TIME', function() {

	return {
		formattedDateTime : function() {
			var currDate = new Date();
			var formattedDate = currDate.getFullYear() + '-'
					+ (currDate.getMonth() + 1) + '-' + currDate.getDate()
					+ ' ' + currDate.getHours() + ':' + currDate.getMinutes()
					+ ':' + currDate.getSeconds();
			return formattedDate;
		}
	};
});

fileItApp.factory('FORMATTED_DATE_TIME', function() {

	return {
		formattedDateTime : function(currDate) {
			var formattedDate = currDate.getFullYear() + '-'
					+ (currDate.getMonth() + 1) + '-' + currDate.getDate()
					+ ' ' + currDate.getHours() + ':' + currDate.getMinutes()
					+ ':' + currDate.getSeconds();
			return formattedDate;
		}
	};
});

fileItApp.factory('FORMATTED_DATE', function() {

	return {
		formattedDate : function(date) {

			function getFormattedData(data) {
				if (data < 10) {
					data = '0' + data;
				}

				return data;
			}

			var formattedDate = date.getFullYear() + '-'
					+ getFormattedData(date.getMonth() + 1) + '-'
					+ getFormattedData(date.getDate());

			return formattedDate;
		}
	};
});

fileItApp.service('HeaderSvc', [ 'RestSvc', 'CURR_DATE_TIME',
		function(RestSvc, CURR_DATE_TIME) {

		} ]);

fileItApp.value('BINDER_NAME', {
	name : ''
});

// IDLE_TIME Placeholder
fileItApp.value('IDLE_TIME', {
	value : ''
});

// TIME_OUT Placeholder
fileItApp.value('TIME_OUT', {
	value : ''
});
