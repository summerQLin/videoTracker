var myApp = angular.module('myApp',[]);
myApp.controller('AppCtrl', function($scope){
  console.log("Hello world from angular controller");
  person1 = {
    name: 'Tim',
    email: 'tim1e@email.com',
    number: '(111)111-1111'
  };

  person2 = {
    name: 'Emily',
    email: 'emily@email.com',
    number: '(222)222-2222'
  };

  var contactlist = [person1, person2];
  $scope.contactlist = contactlist;
})