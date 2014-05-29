'use strict';

describe('Directive: book', function () {

  // load the directive's module
  beforeEach(module('myAngularJsStudyApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<book></book>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the book directive');
  }));
});
