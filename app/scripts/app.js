'use strict';

angular
  .module('myAngularJsStudyApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        // templateUrl: 'views/main.html',
        // controller: 'MainCtrl'
        templateUrl: 'views/editor.html',
        controller: 'EditorCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(['$rootScope', function($rootScope) {


    // movable shape
    $rootScope.canvas_movable_shape = function(obj){
      // start move
      obj.addEventListener('mousedown', function(e){
        var fn;
        var origin_x = e.stageX;
        var origin_y = e.stageY;

        console.log(origin_x, origin_y);

        obj.addEventListener('pressmove' ,fn = function(e){
          obj.regX=origin_x - e.stageX;
          obj.regY=origin_y - e.stageY;
        });

        // finished move
        obj.addEventListener('pressup', function(e){
          obj.x = obj.x - obj.regX;
          obj.y = obj.y - obj.regY;
          obj.regX = 0;
          obj.regY = 0;
          obj.removeEventListener('pressmove', fn);
        });
      });
    };


    // replace image


    // resizer


    // croper
  }])
;
