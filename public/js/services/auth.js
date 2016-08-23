 app.factory('auth', ['$http', function($http){
  var auth = {};

  auth.register = function(user){
    return $http.post('/register', user);
  };

  auth.logIn = function(user){
    return $http.post('/login', user);
  };


  auth.currentUser = null;

  auth.getCurrentUser = function() {
    return $http.get('/currentUser').then(function (response) {
      auth.setCurrentUser(response.data.username);
    });
  }
  
  return auth;
}]);