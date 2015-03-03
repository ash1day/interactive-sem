'use strict';
import Injector = require('../../../../scripts/injector');
var angular = Injector.angular();

import IsemInjector = require('../../../../scripts/isem-injector');
var app       = IsemInjector.app();
var constants = IsemInjector.constants();

interface Scope extends ng.IScope {
  dialog: any;
  vertexIdX: number;
  vertexIdY: number;
}

export class Controller {
  /**
   * @constructor
   * @ngInject
   */
  constructor(
    private $rootScope: ng.IRootScopeService,
    private $scope: Scope
  ) {
    //
  }

  /**
   * @param {string} v - variable
   */
  add(v: string) {
    this.$rootScope.$broadcast(constants.ADD_RELATION, v);
    this.$scope.dialog.close();
  }
}

export function open() {
  var rootElement = <ng.IAugmentedJQuery>angular.element('.ng-scope').eq(0);
  var Dialog = rootElement.injector().get('Dialog');

  var dialog = new Dialog({
    template: '<isem-dialog-add-relation />'
  });
  dialog.open();
}

export class Definition {
  static link($scope: Scope, _: any, __: any, cwModal: any) {
    $scope.dialog = cwModal.dialog;
  }

  static ddo() {
    return {
      controller: Controller,
      controllerAs: 'Controller',
      link: Definition.link,
      require: '^cwModal',
      restrict: 'E',
      scope: {}, // use isolate scope
      templateUrl: app.viewsDir.newDialogs + 'add-relation/add-relation.html'
    }
  }
}

angular.module(app.appName).directive('isemDialogAddRelation', Definition.ddo);