'use strict';
import Injector = require('../../scripts/injector');
var angular = Injector.angular();

import IsemInjector = require('../../scripts/isem-injector');
var app    = IsemInjector.app();
var styles = IsemInjector.styles();

interface Scope extends ng.IScope {
  variableArray(): string[];
}

class Controller {
  /**
   * @constructor
   * @ngInject
   */
  constructor(
    private $rootScope: ng.IRootScopeService,
    private $scope: Scope
  ) {
    // Do nothing
  }
}

class Definition {
  static styling(tElement: ng.IAugmentedJQuery) {
    var mainHeight = styles.mainDisplay.heightRawExp;
    // do not specify 'width: 100%' because of the display position of scroll bar shifted.
    tElement.children('div')
      .css({
        // positioning
        'overflow-y': 'scroll',
        // size
        height: ['calc(', mainHeight, '-', styles.subToolGroup.height, ')'].join(' ')
      });
  }

  static compile(tElement: ng.IAugmentedJQuery, tAttrs: ng.IAttributes, _: any) {
    Definition.styling(tElement);
    return () => {}; // link is do nothing
  }

  static ddo() {
    return {
      compile: Definition.compile,
      controller: Controller,
      controllerAs: 'Controller',
      restrict: 'E',
      templateUrl: app.viewsDir.networkDiagram + 'variable.html',
      scope: {
        variableArray: '&isemIoVariableArray'
      }
    };
  }
}

angular.module(app.appName).directive('isemVariable', Definition.ddo);
