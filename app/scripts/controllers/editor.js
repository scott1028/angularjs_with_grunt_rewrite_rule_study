'use strict';

angular.module('myAngularJsStudyApp')
  .controller('EditorCtrl', function ($scope) {
    // init
    $scope.stage = new createjs.Stage("demoCanvas");

    var circle = new createjs.Shape();
    circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
    circle.x = 100;
    circle.y = 100;


    // make it movable
    $scope.canvas_movable_shape(circle);


    // add to scene
    $scope.stage.addChild(circle);


    // update canvas
    createjs.Ticker.addEventListener("tick", function(){
      $scope.stage.update();
    });
  });
