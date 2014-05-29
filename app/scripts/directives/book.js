'use strict';

angular.module('myAngularJsStudyApp')
  .directive('book', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/book.html'
    };
  });

// yo angular:directive book
