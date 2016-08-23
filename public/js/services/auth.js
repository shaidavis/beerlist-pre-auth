app.factory('auth', ['$http', function($http){
  var auth = {};

  auth.register = function(user){
    return $http.post('/register', user);
  };

  return auth;
}]);