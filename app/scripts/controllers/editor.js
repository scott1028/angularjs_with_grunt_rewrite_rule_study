'use strict';

angular.module('myAngularJsStudyApp')
  .controller('EditorCtrl', function ($scope) {
    // init
    $scope.stage = new createjs.Stage("demoCanvas");

    var circle = new createjs.Shape();
    circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
    circle.x = 100;
    circle.y = 100;


    //
    circle.addEventListener('click', function(e){
      alert(1);
    });


    // add to scene
    $scope.stage.addChild(circle);


    // update canvas
    createjs.Ticker.addEventListener("tick", function(){
      $scope.stage.update();
    });
  });
