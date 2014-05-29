'use strict';

angular.module('myAngularJsStudyApp')
  .directive('user', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the user directive');
      }
    };
  });
