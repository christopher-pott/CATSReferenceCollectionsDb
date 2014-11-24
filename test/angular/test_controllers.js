/**
 * Angular Controller Tests
 */

describe('clicking search button', function() {

    var scope;
    var ctrl;
    var state = {};
    var location;
    var httpBackend;
    var modal;
    var catsAPIservice;
    
    var LocationMock = function (initialPath) {
        var pathStr = initialPath || '';
        this.path = function (pathArg) {
          return pathArg ? pathStr = pathArg : pathStr;
        };
      };
    
    beforeEach(module('myApp.services'));      /*'state' & 'catsAPIservice' */
    beforeEach(module('myApp.controllers'));   

    beforeEach(inject(function($controller, $rootScope,  $httpBackend, _state_, 
                               $location, $modal, _catsAPIservice_) {
        
        scope = $rootScope.$new();
        httpBackend = $httpBackend;
        state = _state_;
        location = $location;
        modal = $modal;
        catsAPIservice = _catsAPIservice_;
        
//        spyOn($location, 'path').andCallFake(new LocationMock().path);

        ctrl = $controller('AppCtrl',
                {$scope: scope, 
                 $httpBackend : httpBackend,
                 $location: location,
                 $modal: modal,
                });

    }));

    it('should have an initial searchRequested state of false', function(){
        expect(state.searchRequested.should.equal(false));
    });
    it('should have an final searchRequested state of true', function(){
        scope.searchClicked();
        expect(state.searchRequested.should.equal(true));

    });
    

});
