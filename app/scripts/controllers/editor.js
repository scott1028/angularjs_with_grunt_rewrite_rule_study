'use strict';

angular.module('myAngularJsStudyApp')
  .controller('EditorCtrl', function ($scope) {
    // init
    $scope.stage = new createjs.Stage("demoCanvas");

    var circle = new createjs.Shape();
    circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
    circle.x = 100;
    circle.y = 100;
    $scope.stage.addChild(circle);

    $scope.stage.update();
  });
