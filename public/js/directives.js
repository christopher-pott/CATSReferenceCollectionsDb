'use strict';

/* Directives */

angular.module('myApp.directives', [])
.directive('appVersion', function (version) {
  return function(scope, elm, attrs) {
    elm.text(version);
  };
})
/*solves bug : http://stackoverflow.com/questions/22641834/angularjs-corousel-stops-working*/
.directive('disableAnimation', function($animate){
    return {
        restrict: 'A',
        link: function($scope, $element, $attrs){
            $attrs.$observe('disableAnimation', function(value){
                $animate.enabled(!value, $element);
            });
        }
    }
})
/*Solves date timezone bug: https://github.com/angular-ui/bootstrap/issues/2072
 * 
 * Removes the timezone (and hence the unwanted localisation) from dates 
 * 
 * Usage: datepicker-localdate
 * */
.directive('datepickerLocaldate', ['$parse', function ($parse) {
    var directive = {
        restrict: 'A',
        require: ['ngModel'],
        link: link
    };
    return directive;

    function link(scope, element, attr, ctrls) {
        var ngModelController = ctrls[0];

        // called with a JavaScript Date object when picked from the datepicker
        ngModelController.$parsers.push(function (viewValue) {

            if(!viewValue){
                return null; /*cpo : otherwise dates are persisted on scope even when deleted*/
            }
            // undo the timezone adjustment we did during the formatting
            viewValue.setMinutes(viewValue.getMinutes() - viewValue.getTimezoneOffset());
            // we just want a local date in ISO format
            return viewValue.toISOString().substring(0, 10);
        });

        // called with a 'yyyy-mm-dd' string to format
        ngModelController.$formatters.push(function (modelValue) {
            if (!modelValue) {
                return undefined;
            }
            // date constructor will apply timezone deviations from UTC (i.e. if locale is behind UTC 'dt' will be one day behind)
            var dt = new Date(modelValue);
            // 'undo' the timezone offset again (so we end up on the original date again)
            dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());
            return dt;
        });
    }
}]);
//.directive('ngThumb', ['$window', function($window) {
//    var helper = {
//        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
//        isFile: function(item) {
//            return angular.isObject(item) && item instanceof $window.File;
//        },
//        isImage: function(file) {
//            var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
//            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
//        }
//    };
//
//    return {
//        restrict: 'A',
//        template: '<canvas/>',
//        link: function(scope, element, attributes) {
//            if (!helper.support) return;
//
//            var params = scope.$eval(attributes.ngThumb);
//
//            if (!helper.isFile(params.file)) return;
//            if (!helper.isImage(params.file)) return;
//
//            var canvas = element.find('canvas');
//            var reader = new FileReader();
//
//            reader.onload = onLoadFile;
//            reader.readAsDataURL(params.file);
//
//            function onLoadFile(event) {
//                var img = new Image();
//                img.onload = onLoadImage;
//                img.src = event.target.result;
//            }
//
//            function onLoadImage() {
//                var width = params.width || this.width / this.height * params.height;
//                var height = params.height || this.height / this.width * params.width;
//                canvas.attr({ width: width, height: height });
//                canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
//            }
//        }
//    };
//}]);

