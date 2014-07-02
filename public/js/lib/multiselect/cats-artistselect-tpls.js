angular.module('ui.catsartistselect', [
  'catsartistselect.tpl.html'
])

  //from bootstrap-ui typeahead parser
  //define 'parse' service
  .factory('catsoptionParser', ['$parse', function ($parse) {
    //  ^        start of line
	//  \s*     zero or more whitespace
	//	(.*?)   group of any characters together (the whole string) array 1
	//	(?: starts a non-capturing group - so this won't be captured in the array
	//  (?:\s+as\s+(.*?))?   this ignores " as _label_"	
	//  (?:\s+grouped\s+as\s+\((.*?\s+in\s+.*?)\))  this ignores the grouped by clause
	//  \s+for\s+   matches " for "
	//  (?:([\$\w][\$\w\d]*)) matches the item name
	 
	//                     0000011111022222222000000000000000000000033333000000000000004444444444444444000000000055550
	var TYPEAHEAD_REGEXP = /^\s*(.*?)(?:\s(.*?))?(?:\s+group\s+by\s+(.*?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+(.*)$/;

    return {
    	parse: function (input) {
    		
    		// https://gist.github.com/guillaume86/5638205   
    		// angular-bootstrap-typeahead.js    		

    		var match = input.match(TYPEAHEAD_REGEXP), modelMapper, viewMapper, source;
    		if (!match) {
    			throw new Error(
    					"Expected typeahead specification in form of '_modelValue_ (_translation_)? (group by _group_)? for _item_ in _collection_'" +
    					" but got '" + input + "'.");
    		}
    		//$parse converts an Angular expression into a function (think "getter")
    		return {
    			itemName: match[4],             //the alias for the item
    			grpName: match[3],              //the alias of the group
    			source: $parse(match[5]),       //the source list of objects for the select
    			viewMapper: $parse(match[1]),   //main label
    			modelMapper: $parse(match[2]),  //danish translation
    			groupMapper: $parse(match[3])   //group
    		};
    	}
    };
  }])
  .factory('apiService', ['$http', function ($http) {
 
    return {
		getCorpusArtworkById : function(id) {
 			var url = "searchsmk?id=" + id;
    		return $http.get(url);
        },
        getCatsArtworkById : function(id) {
			var url = "artwork?id=" + id;
			return $http.get(url);
		}
    };
  }])
  .directive('catsartistselect', ['$http', '$parse', '$document', '$compile', '$interpolate', 'catsoptionParser', 'apiService',

    function ($http, $parse, $document, $compile, $interpolate, catsoptionParser, apiService) {
      return {
        restrict: 'E',
        require: 'ngModel',
        link: function (originalScope, element, attrs, modelCtrl) {

          var exp = attrs.options,
            parsedResult = catsoptionParser.parse(exp),
            isMultiple = attrs.multiple ? true : false,
            required = false,
            scope = originalScope.$new(), /*creates a child scope*/
            changeHandler = attrs.change || angular.noop;

          scope.items = [];
          scope.groups = [];
          scope.header = 'Select';
          scope.multiple = isMultiple;
          scope.disabled = false;
          scope.loading = false;

          originalScope.$on('$destroy', function () {
            scope.$destroy();
          });

          var popUpEl = angular.element('<catsartistselect-popup></catsartistselect-popup>');

          //required validator
          if (attrs.required || attrs.ngRequired) {
            required = true;
          }
          attrs.$observe('required', function(newVal) {
            required = newVal;
          });

          //watch disabled state
          scope.$watch(function () {
            return $parse(attrs.disabled)(originalScope);
          }, function (newVal) {
            scope.disabled = newVal;
          });

          //watch single/multiple state for dynamically change single to multiple
          scope.$watch(function () {
            return $parse(attrs.multiple)(originalScope);
          }, function (newVal) {
            isMultiple = newVal || false;
          });

          //watch option changes for options that are populated dynamically
          //disabled by CPO
          scope.$watch(function () {
        	 /* pass the context (originalScope) to the getter we defined earlier*/
            return parsedResult.source(originalScope);
          }, function (newVal) {
            if (angular.isDefined(newVal))
              parseModel();
          }, true);
          
          //watch model change
          scope.$watch(function () {
            return modelCtrl.$modelValue;
          }, function (newVal, oldVal) {
            //when directive initialize, newVal usually undefined. Also, if model value already set in the controller
            //for preselected list then we need to mark checked in our scope item. But we don't want to do this every time
            //model changes. We need to do this only if it is done outside directive scope, from controller, for example.
            if (angular.isDefined(newVal)) {
              markChecked(newVal);
              scope.$eval(changeHandler);
            }
            getHeaderText();
            modelCtrl.$setValidity('required', scope.valid());
          }, true);

          function parseModel() {
            scope.items.length = 0;
            scope.groups.length = 0;
            var model = parsedResult.source(originalScope);
            if(!angular.isDefined(model)) return;
            
            for (var i = 0; i < model.length; i++) {
                var local = {};
                local[parsedResult.itemName] = model[i];
            	var grpName = parsedResult.groupMapper(local);
            	
            	if (!grpName){ 
            		grpName = 'Results from CATS'; //create an empty group for orphans
            		local[parsedResult.itemName][parsedResult.grpName] = grpName;
            	}
            	
            	var grpIndex = -1;
            	
            	//indexOf this group
            	for(var ix = 0, len = scope.groups.length; ix < len; ix++) {
            	    if (scope.groups[ix].name === grpName) {
            	    	grpIndex = ix;
            	        break;
            	    }
            	}
            	//create new group
            	if (grpIndex < 0 ){
            		var grp = {name: "", items: []};
            		grp.name = grpName;
            		grpIndex = scope.groups.push(grp) - 1;
            		//scope.groups[grpIndex].items = [];
            	}
            	var tag = parsedResult.viewMapper(local).inventoryNum + " " + parsedResult.viewMapper(local).title;
            	var translation = parsedResult.modelMapper(local);
            	if(translation) {
            		tag += " (" + parsedResult.modelMapper(local) + ")";
            	}
            	//add item
                scope.groups[grpIndex].items.push({
                  label: tag,
                  model: model[i],
                  checked: false,
                  group: parsedResult.groupMapper(local)
                });
            }
          }

          parseModel();

          element.append($compile(popUpEl)(scope));

          function getHeaderText() {
            if (is_empty(modelCtrl.$modelValue)) return scope.header = attrs.msHeader || 'Select';

              if (isMultiple) {
//                  if (attrs.msSelected) {
                  //    scope.header = $interpolate(attrs.msSelected)(scope);
                	  scope.header = "";
                	  for (i=0; modelCtrl.$modelValue.length > i;i++){
                		  scope.header += modelCtrl.$modelValue[i].name;
                		  if(modelCtrl.$modelValue.length > i + 1) {scope.header += ", "}
                	  }
//                  } else {
//                      scope.header = modelCtrl.$modelValue.length + ' ' + 'selected';
//                  }

            } else {
              var local = {};
              local[parsedResult.itemName] = modelCtrl.$modelValue;
              scope.header = parsedResult.viewMapper(local).inventoryNum;
            }
          }

          function is_empty(obj) {
            if (!obj) return true;
            if (obj.length && obj.length > 0) return false;
            for (var prop in obj) if (obj[prop]) return false;
            return true;
          };

          scope.valid = function validModel() {
            if(!required) return true;
            var value = modelCtrl.$modelValue;
            return (angular.isArray(value) && value.length > 0) || (!angular.isArray(value) && value != null);
          };

          function selectSingle(item) {
            if (item.checked) {
              scope.uncheckAll();
            } else {
              scope.uncheckAll();
              item.checked = !item.checked;
            }
            setModelValue(false);
          }

          function selectMultiple(item) {
            item.checked = !item.checked;
            setModelValue(true);
          }

          function setModelValue(isMultiple) {
            var value;

            if (isMultiple) {
              value = [];
              angular.forEach(scope.groups, function (group) {
                angular.forEach(group.items, function (item) {
                    if (item.checked) value.push(item.model);
                })
              })
            } else {
              angular.forEach(scope.groups, function (group) {
                  angular.forEach(group.items, function (item) {
                      if (item.checked) {
                        value = item.model;
                        return false;
                      }
                    })
                })
            }
            modelCtrl.$setViewValue(value);
          }

          function markChecked(newVal) {
            if (!angular.isArray(newVal)) {
              angular.forEach(scope.groups, function (group) {
                  angular.forEach(group.items, function (item) {
                      if (angular.equals(item.model, newVal)) {
                        item.checked = true;
                        return false;
                      }
                  });
              });
            } else {
              angular.forEach(scope.groups, function (group) {
                  angular.forEach(group.items, function (item) {
                      item.checked = false;
                      angular.forEach(newVal, function (i) {
                        if (angular.equals(item.model, i)) {
                          item.checked = true;
                        }
                      });
                  });
              });
            }
          }

          scope.checkAll = function () {
            if (!isMultiple) return;
            angular.forEach(scope.groups, function (group) {
               angular.forEach(group.items, function (item) {
                 item.checked = true;
               });
            });
            setModelValue(true);
          };

          scope.uncheckAll = function () {
            angular.forEach(scope.groups, function (group) {
              angular.forEach(group.items, function (item) {
                item.checked = false;
              });
            });
            setModelValue(true);
          };

          scope.select = function (item) {
            if (isMultiple === false) {
              selectSingle(item);
              scope.toggleSelect();
            } else {
              selectMultiple(item);
            }
          };
          
          scope.searchSmk = function (id) {
   			scope.loading = true; /*show spinner*/
   			apiService.getCorpusArtworkById(id)
	    		.success(function (resp) {
	   	 			scope.loading = false; /*hide spinner*/
	     			var artwork = {};
	    			var solrResp = resp.response;
	    			if (solrResp.numFound === 1){ /*there can be only one*/
		    			var doc = solrResp.docs[0];
		    			artwork.corpusId = doc.csid;
		    			artwork.inventoryNum = doc.id;
		    			artwork.title = doc.title_first;
		    			artwork.productionDateEarliest = (doc.object_production_date_earliest) ? doc.object_production_date_earliest : "";
		    			artwork.productionDateLatest = (doc.object_production_date_latest) ? doc.object_production_date_latest : "";
		    			for(i=0, artwork.artist = "";i<doc.artist_name.length;i++){
		    				artwork.artist += doc.artist_name[i];
		    				artwork.artist += (doc.artist_name.length-1 > i) ?  ", " : "";
	    			    }
		    			if(doc.heigth && doc.width && doc.widthunit){
		    				artwork.dimensions = doc.heigth + " x " + doc.width + " " + doc.widthunit;
		    			}
		    			if(doc.prod_technique_en){
		    				artwork.technique = doc.prod_technique_en;
		    				if(doc.prod_technique_dk){
		    					artwork.technique += " (" + doc.prod_technique_dk + ")";
		    				}
		    			}
		    			artwork.owner = ""; /*not available yet from solr*/
	    			}else if (solrResp.numFound === 0){
	    				/*not found, message*/
	    			}else{
	    				/*more than one shouldn't happen*/
	    			}
	   				if (artwork && artwork.inventoryNum){
	   		        	scope.groups[scope.groups.length] = 
	   		        	{name:"Results from Corpus", 
	   	                 items:[{label:artwork.inventoryNum + " " + artwork.title,
	   	                         model:artwork}]
	   					 };
	   	            }
	    		})
	    		.error(function (response) {
	              //  parseModel();
	    	    })
   		  };
   			
          scope.searchCats = function (id) {
        	scope.toggleSelect();
   			scope.loading = true; /*show spinner*/
   			apiService.getCatsArtworkById(id)
	    		.success(function (resp) {
	   	 			scope.loading = false; /*hide spinner*/
	     			var artwork = resp;
	   				if (artwork){
	   					scope.groups = [{name:  "Results from CATS", items:[]}];
	   					for(i=0;i < artwork.rowCount;i++){
	   						var record = artwork.rows[i].artwork_record;
	   						scope.groups[0].items[i] = {label:record.inventoryNum + " " +  record.title, 
	   								                    model:record
	   						}
	   					}
	   	            }
	    		})
	    		.error(function (response) {
	   	 			scope.loading = false; /*hide spinner*/
	              //  parseModel();
	    	    })
       	   };
         }
      }
    }])

  .directive('catsartistselectPopup', ['$document', function ($document) {
    return {
      restrict: 'E',
      scope: false,
      replace: true,
      templateUrl: 'catsartistselect.tpl.html',
      link: function (scope, element, attrs) {

        scope.isVisible = false;

        scope.toggleSelect = function () {
          if (element.hasClass('open')) {
            element.removeClass('open');
            $document.unbind('click', clickHandler);
          } else {
            element.addClass('open');
            $document.bind('click', clickHandler);
            scope.focus();
          }
        };

        function clickHandler(event) {
          if (elementMatchesAnyInArray(event.target, element.find(event.target.tagName)))
            return;
          element.removeClass('open');
          $document.unbind('click', clickHandler);
          scope.$apply();
          
//        call a service to check if this exact id number matches database
//        this is the wrong place: the event is the button
        }

        scope.focus = function focus(){
          var searchBox = element.find('input')[0];
          searchBox.focus();
        }

        var elementMatchesAnyInArray = function (element, elementArray) {
          for (var i = 0; i < elementArray.length; i++)
            if (element == elementArray[i])
              return true;
          return false;
        }
      }
    }
  }]);

angular.module('catsartistselect.tpl.html', [])

  .run(['$templateCache', function($templateCache) {
    $templateCache.put('catsartistselect.tpl.html',

      "<div class=\"btn-group\">\n" +
      "  <div class=\"input-group\">" + 
      "  <input class=\"searchInput form-control\" ng-model=\"searchText.$\" type=\"text\" placeholder=\"Inventory number\">\n" +
      "  <span class=\"input-group-btn\">" +
//      "    <button type=\"button\" class=\"btn btn-default dropdown-toggle\" ng-click=\"toggleSelect()\" ng-disabled=\"disabled\" ng-class=\"{'error': !valid()}\">\n" +
//      "    <button type=\"button\" class=\"btn btn-default\" ng-click=\"toggleSelect()\" ng-disabled=\"disabled\" ng-class=\"{'error': !valid()}\">\n" +
    "    <button type=\"button\" class=\"btn btn-default\" ng-click=\"searchCats(searchText.$)\" ng-disabled=\"disabled\" ng-class=\"{'error': !valid()}\">\n" +
      "      <i class=\"glyphicon glyphicon-search\"></i>\n" +
//      "      {{header}} \n" +
//      "    {{header}} <span class=\"caret\"></span>\n" +
      "    </button>\n" +
      "  </span>" +
      "  </div>" +
      "  <ul class=\"dropdown-menu\">\n" +
      "  <div class=\"row uigroup\">" +
      "    <div ng-show=\"multiple\" role=\"presentation\" class=\"col col-sm-8\">\n" +
      "      <button class=\"btn btn-link btn-xs\" ng-click=\"checkAll()\" type=\"button\"><i class=\"glyphicon glyphicon-ok\"></i> Check all</button>\n" +
      "      <button class=\"btn btn-link btn-xs\" ng-click=\"uncheckAll()\" type=\"button\"><i class=\"glyphicon glyphicon-remove\"></i> Uncheck all</button>\n" +
      "    </div>" +
//      "    <div ng-show=\"multiple\" role=\"presentation\" class=\"col col-sm-4\">\n" +
//      "      <button class=\"btn btn-link btn-xs\" ng-click=\"addItem()\" type=\"button\"><i class=\"glyphicon glyphicon-plus\"></i> New item </button>\n" +
//      "    </div>" +      
      "  </div>" +
      "  <div class=\"row uigroup\">" + 
//      "    <div class=\"col col-sm-8\">\n" +
//      "      <input class=\"form-control\" type=\"text\" ng-model=\"searchText.$\" autofocus=\"autofocus\" placeholder=\"Filter\" />\n" +
//      "    </div>" +      
      "    <div class=\"col col-sm-12\" ng-show= \"(groups | filter:searchText).length == 0\">\n" +
      "       Artwork {{searchText.$}} not found.\n" +
      "       <button class=\"btn btn-default\" ng-click=\"searchSmk(searchText.$)\" type=\"button\"><i class=\"glyphicon glyphicon-search\"></i> Search SMK </button>\n" +
      "       <div class=\"spinner\" ng-show=\"loading\">...loading...</div>" +
      "    </div>" +
      "  </div>" +
      "  <div class=\"row uigroup\">" + 
      "    <div class=\"col col-sm-1\">\n" +
      "    </div>" +
      "    <div class=\"col col-sm-10\">\n" +
      "    <ul ng-repeat=\"g in groups | filter:searchText\">\n" +
      "       <label ng-show=\"g.name != false\">" +
      "        {{g.name}}\n" +
      "       </label>" +
      "      <li ng-repeat=\"i in g.items | filter:searchText\">\n" +
      "       <label style=\"font-weight: normal\">" +
      "        <input type=\"checkbox\" ng-disabled=\"empty\" ng-checked=\"i.checked\" ng-click=\"select(i)	\"/>" +
//      "        <a ng-click=\"select(i)\">\n" +
//      "          <i class=\"glyphicon\" ng-class=\"{'glyphicon-check': i.checked, 'glyphicon-unchecked': !i.checked}\"></i></a>\n" +
      "        <span> {{i.label}}</span>\n" +
      "       </label>" +
      "      </li>\n" +
      "    </ul>\n" +
      "    </div>" +    
      "  </div>" +      
      "  </ul>\n" +
      "</div>");
  }]);
