'use strict';
angular.module('myAngularJsStudyApp')
.directive('ssdNavbar', function() {
    return {
        restrict: 'E',
        templateUrl: '/views/navbar.html'
    };
})
.directive('ssdFooter', function() {
    return {
        restrict: 'E',
        templateUrl: '/views/footer.html'
    };
})
.directive('ssdPagination', function() {
    return {
        restrict: 'E',
        scope: {
            pagination: '='
        },
        templateUrl: '/views/pagination.html'
    };
})
.directive('toNumber', function() {
    return {
        require: 'ngModel',
        link: function(scope, elem, attrs, ctrl) {
            ctrl.$parsers.push(function(value) {
                if (value === 0)
                    return 0;

                return parseFloat(value || '');
            });
        }
    };
})
.directive("datepicker", function() {
    return {
        restrict: "A",
        require: "ngModel",
        link: function(scope, elem, attrs, ngModelCtrl) {
            var updateModel = function(dateText) {
                scope.$apply(function() {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: "yy-mm-dd",
                onSelect: function(dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    }
})
.directive('ssdBreadcrumb', function() {
    return {
        restrict: 'AEC',
        scope: {
            breadcrumbs: '=breadcrumbs'
        },
        templateUrl: '/views/breadcrumb.html'
    };
})
.directive('fileModel', ['$parse',
    function($parse) {
        // refer to http://uncorkedstudios.com/blog/multipartformdata-file-upload-with-angularjs
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function() {
                    scope.$apply(function() {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }
])

.directive('unicodeMaxLength', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {

            ctrl.$parsers.push(function(val) {

                var getUTF8Length = function(string) {
                    var utf8length = 0;
                    for (var n = 0; n < string.length; n++) {
                        var c = string.charCodeAt(n);
                        if (c < 128) {
                            utf8length++;
                        } else if ((c > 127) && (c < 2048)) {
                            utf8length = utf8length + 2;
                        } else {
                            utf8length = utf8length + 3;
                        }
                    }
                    return utf8length;
                }

                if (getUTF8Length(val) > parseInt(attrs.unicodeMaxLength)) {
                    ctrl.$setViewValue(val.slice(0, -1));
                    ctrl.$render();
                    return val.slice(0, -1)
                }

                return val;
            });
        }
    }
})

.directive('decimalTo', function($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var reg = new RegExp('\\d*\\.*\\d{0,' + (attrs.decimalTo || '2') + '}');

            var getDecimalValue = function(string) {
                var _val = string.match(reg)[0];

                if (parseFloat(_val) > parseFloat(attrs.maxValue || '99999.99')) {
                    // _val = attrs.maxValue || '99999.99';
                    _val = _val.slice(0, -1);
                }

                return _val;
            }

            elm.blur(elm.val(), function() {
                if (this.value != '') {
                    this.value = parseFloat(getDecimalValue(this.value));
                }
            })

            ctrl.$parsers.push(function(val) {
                if (getDecimalValue(val) != val) {
                    ctrl.$setViewValue(getDecimalValue(val));
                    ctrl.$render();
                    return getDecimalValue(val);
                }

                return val;
            });
        }
    }
})

.directive('dynamicMaxLength', function($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var config = attrs.dynamicMaxLength || '{}';
            config = JSON.parse(config);

            ctrl.$parsers.push(function(val) {
                if (config[attrs.dynamicMaxLengthTarget]) {
                    attrs.$set('maxlength', parseInt(config[attrs.dynamicMaxLengthTarget]));
                }

                return val;
            });
        }
    }
})

.directive('spaceInputNotAllowed', function($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var config = attrs.spaceInputNotAllowed || false;
            config = JSON.parse(config);

            elm.blur(function(e) {
                e.target.value = e.target.value.trim();
            });

            ctrl.$parsers.push(function(val) {
                if (config) {
                    if (val.replace(/ /g, '') != val) {
                        ctrl.$setViewValue(val.replace(/ /g, ''));
                        ctrl.$render();
                        return val.replace(/ /g, '');
                    }
                };

                return val;
            });
        }
    }
})

// issue #497
.directive('valueValidator', function($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            if (attrs.valueValidator) {
                var reg = new RegExp(attrs.valueValidator);
            } else {
                var reg = /^[A-z0-9_\- ]*$/;
            }

            elm.blur(function(e) {
                e.target.value = e.target.value.trim();
                if (e.target.value.match(reg) != null) {

                } else {
                    if (attrs.valueValidatorWording) {
                        alert(attrs.valueValidatorWording);
                    } else if (attrs.valueValidator) {
                        alert('You only can input: "' + attrs.valueValidator + '"');
                    } else {
                        alert('You only can input: "A-z, 0-9 or -, _"');
                    }
                    elm.focus();
                }
            });
        }
    }
})

// 英數字, 逗號, 分號, 句號, 驚嘆號
.directive('valueValidatorA', function($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var flag = attrs.valueValidatorA;
            var reg, msg;
            if (flag == '1') {
                reg = /^[\u0030-\u0039\u003b\u0041-\u005a\u0061-\u007a\u002e\u0021]*$/;
                msg = '僅能輸入：英數字, 逗號, 分號, 句號, 驚嘆號(選擇填寫)';
            } else if (flag == '2') {
                reg = /^[\u0030-\u0039\u003b\u0041-\u005a\u0061-\u007a\u002e\u0021\u0020]*$/;
                msg = '僅能輸入：英數字, 逗號, 分號, 句號, 驚嘆號(選擇填寫)';
            } else {
                reg = /^[\u0030-\u0039\u003b\u0041-\u005a\u0061-\u007a\u002e\u0021]+$/;
                msg = '僅能輸入：英數字, 逗號, 分號, 句號, 驚嘆號(必須填寫)';
            };

            elm.blur(function(e) {
                e.target.value = e.target.value.trim();
                if (e.target.value.match(reg) != null) {
                    //
                } else {
                    alert(msg);
                    elm.focus();
                }
            });
        }
    }
})

// 中英數字, 逗號, 分號, 句號, 驚嘆號
.directive('valueValidatorB', function($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var flag = attrs.valueValidatorB;
            var reg, msg;
            if (flag == '1') {
                reg = /^[\u3400-\u9FFF\u0030-\u0039\u003b\u0041-\u005a\u0061-\u007a\u002e\u0021]*$/;
                msg = '僅能輸入：中英數字, 逗號, 分號, 句號, 驚嘆號(選擇填寫)';
            } else if (flag == '2') {
                reg = /^[\u3400-\u9FFF\u0030-\u0039\u003b\u0041-\u005a\u0061-\u007a\u002e\u0021\u0020]*$/;
                msg = '僅能輸入：中英數字, 逗號, 分號, 句號, 驚嘆號(選擇填寫)';
            } else if (flag == '3') {
                reg = /^[\u3400-\u9FFF\u0030-\u0039\u003b\u0041-\u005a\u0061-\u007a\u002e\u0021\u0020]+$/;
                msg = '僅能輸入：中英數字, 逗號, 分號, 句號, 驚嘆號(必須填寫)';
            } else {
                reg = /^[\u3400-\u9FFF\u0030-\u0039\u003b\u0041-\u005a\u0061-\u007a\u002e\u0021]+$/;
                msg = '僅能輸入：中英數字, 逗號, 分號, 句號, 驚嘆號(必須填寫)';
            }
            elm.blur(function(e) {
                e.target.value = e.target.value.trim();
                if (e.target.value.match(reg) != null) {
                    //
                } else {
                    alert(msg);
                    elm.focus();
                }
            });
        }
    }
})

// 英數字
.directive('valueValidatorC', function($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var flag = attrs.valueValidatorC;
            var reg, msg;
            if (flag == '1') {
                reg = /^[\u0030-\u0039\u0041-\u005a\u0061-\u007a]*$/;
                msg = '僅能輸入：英數字(選擇填寫)';
            } else if (flag == '2') {
                reg = /^[\u0030-\u0039\u0041-\u005a\u0061-\u007a\u0020]+$/;
                msg = '僅能輸入：英數字(必須填寫)';
            } else if (flag == '3') {
                reg = /^[\u0030-\u0039\u0041-\u005a\u0061-\u007a\u0020]*$/;
                msg = '僅能輸入：英數字(選擇填寫)';
            } else {
                reg = /^[\u0030-\u0039\u0041-\u005a\u0061-\u007a]+$/;
                msg = '僅能輸入：英數字(必須填寫)';
            }
            elm.blur(function(e) {
                e.target.value = e.target.value.trim();
                if (e.target.value.match(reg) != null) {
                    //
                } else {
                    alert(msg);
                    elm.focus();
                }
            });
        }
    }
})

// 數字
.directive('valueValidatorD', function($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var flag = attrs.valueValidatorD;
            var reg, msg;
            if (flag == '1') {
                reg = /^[\u0030-\u0039]*$/;
                msg = '僅能輸入：數字(選擇填寫)'
            } else if (flag == '2') {
                reg = /^[\u0030-\u0039\u0020]*$/;
                msg = '僅能輸入：數字(選擇填寫)'
            } else {
                reg = /^[\u0030-\u0039]+$/;
                msg = '僅能輸入：數字(必須填寫)'
            }
            elm.blur(function(e) {
                e.target.value = e.target.value.trim();
                if (e.target.value.match(reg) != null) {
                    //
                } else {
                    alert(msg);
                    elm.focus();
                }
            });
        }
    }
})

// 英數字, 底線, dash 不可以在第一位
.directive('valueValidatorE', function($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var flag = attrs.valueValidatorC;
            var reg, msg;
            if (flag == '1') {
                reg = /^[\u0030-\u0039\u0041-\u005a\u0061-\u007a\u005f]*$/;
                msg = '僅能輸入：英數字, 且 Dash 不可在第一位(選擇填寫)';
            } else if (flag == '2') {
                reg = /^[\u0030-\u0039\u0041-\u005a\u0061-\u007a\u0020\u005f]+$/;
                msg = '僅能輸入：英數字, 空格, 且 Dash 不可在第一位(必須填寫)';
            } else {
                reg = /^[\u0030-\u0039\u0041-\u005a\u0061-\u007a\u005f]+$/;
                msg = '僅能輸入：英數字, 且 Dash 不可在第一位(必須填寫)';
            }
            elm.blur(function(e) {
                e.target.value = e.target.value.trim();
                if (e.target.value.match(reg) != null & e.target.value[0] != '_') {
                    //
                } else {
                    alert(msg);
                    elm.focus();
                }
            });
        }
    }
})

// 輸入時只能接受 英文、數字、、dash \'-\' ,且底線、dash 不可以在第一位
.directive('valueValidatorId', function($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var reg, msg;
            reg = /[0-9A-Za-z\-]*/;
            msg = '輸入時只能接受 英文、數字、dash \'-\' ,且dash 不可以在第一位';
            elm.blur(function(e) {
                if(e.target.value.length > 0){
                    e.target.value = e.target.value.trim();
                    if (e.target.value.match(reg) != null & e.target.value[0] != '-' && e.target.value.match(reg)[0] == e.target.value) {
                        //
                    } else {
                        alert(msg);
                        elm.focus();
                    }
                }
            });
        }
    }
})

// 允許輸入英數字含空白, 但符號 ‘~’, ‘$’, ‘^’, ‘@’, 底線共五種不得輸入
.directive('valueValidatorEName', function($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var reg, msg;
            reg = /[~$^@_]/;
            msg = '允許輸入英數字含空白, 但符號 ‘~’, ‘$’, ‘^’, ‘@’, 底線共五種不得輸入';
            elm.blur(function(e) {
                if(e.target.value.length > 0){
                    e.target.value = e.target.value.trim();
                    if (e.target.value.match(reg) != null) {
                        alert(msg);
                        elm.focus();
                    } else {
                        var reg2 = /[\u0020-\u007e]*/;
                        if(e.target.value.match(reg2) != null && e.target.value.match(reg2)[0] == e.target.value){

                        }
                        else{
                            alert(msg);
                            elm.focus();
                        }
                    }
                }
            });
        }
    }
})

// 允許輸入繁中含空白,但符號 ‘~’, ‘$’, ‘^’, ‘@’, 底線共五種不得輸入
.directive('valueValidatorTcName', function($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var reg, msg;
            reg = /[~$^@_]/;
            msg = '允許輸入繁中含空白,但符號 ‘~’, ‘$’, ‘^’, ‘@’, 底線共五種不得輸入';
            elm.blur(function(e) {
                if(e.target.value.length > 0){
                    e.target.value = e.target.value.trim();
                    if (e.target.value.match(reg) != null) {
                        alert(msg);
                        elm.focus();
                    } else {
                        
                    }
                }
            });
        }
    }
})

// 允許輸入簡中含空白,但符號 ‘~’, ‘$’, ‘^’, ‘@’, 底線共五種不得輸入
.directive('valueValidatorScName', function($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var reg, msg;
            reg = /[~$^@_]/;
            msg = '允許輸入簡中含空白,但符號 ‘~’, ‘$’, ‘^’, ‘@’, 底線共五種不得輸入';
            elm.blur(function(e) {
                if(e.target.value.length > 0){
                    e.target.value = e.target.value.trim();
                    if (e.target.value.match(reg) != null) {
                        alert(msg);
                        elm.focus();
                    } else {
                        
                    }
                }
            });
        }
    }
})

// 允許輸入繁中含空白,但符號 ‘~’, ‘$’, ‘^’, ‘@’, 底線共五種不得輸入
.directive('valueValidatorEDescription', function($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var reg, msg;
            reg = /[~$^@_]/;
            msg = '允許輸入英數字含空白,但符號 ‘~’, ‘$’, ‘^’, ‘@’, 底線共五種不得輸入';
            elm.blur(function(e) {
                if(e.target.value.length > 0){
                    e.target.value = e.target.value.trim();
                    if (e.target.value.match(reg) != null) {
                        alert(msg);
                        elm.focus();
                    } else {
                        var reg2 = /[\u0020-\u007e]*/;
                        if(e.target.value.match(reg2) != null && e.target.value.match(reg2)[0] == e.target.value){
                            
                        }
                        else{
                            alert(msg);
                            elm.focus();
                        }
                    }
                }
            });
        }
    }
})

// 允許輸入繁中含空白,但符號 ‘~’, ‘$’, ‘^’, ‘@’, 底線共五種不得輸入
.directive('valueValidatorTcDescription', function($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var reg, msg;
            reg = /[~$^@_]/;
            msg = '允許輸入繁中含空白,但符號 ‘~’, ‘$’, ‘^’, ‘@’, 底線共五種不得輸入';
            elm.blur(function(e) {
                if(e.target.value.length > 0){
                    e.target.value = e.target.value.trim();
                    if (e.target.value.match(reg) != null) {
                        alert(msg);
                        elm.focus();
                    } else {
                        
                    }
                }
            });
        }
    }
})

// 允許輸入簡中含空白,但符號 ‘~’, ‘$’, ‘^’, ‘@’, 底線共五種不得輸入
.directive('valueValidatorScDescription', function($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var reg, msg;
            reg = /[~$^@_]/;
            msg = '允許輸入簡中含空白,但符號 ‘~’, ‘$’, ‘^’, ‘@’, 底線共五種不得輸入';
            elm.blur(function(e) {
                if(e.target.value.length > 0){
                    e.target.value = e.target.value.trim();
                    if (e.target.value.match(reg) != null) {
                        alert(msg);
                        elm.focus();
                    } else {
                        
                    }
                }
            });
        }
    }
})

// yyyy-dd-mm
.directive('valueValidatorDate', function($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var flag = attrs.valueValidatorC;
            var msg = '僅能輸入：YYYY-MM-DD';
            elm.blur(function(e) {
                e.target.value = e.target.value.trim();
                if(e.target.value.length > 0){
                    if((new Date(e.target.value)).toJSON() != null && e.target.value.match(/\d+-\d+-\d+/) != null){
                        //
                    } else {
                        alert(msg);
                        elm.focus();
                    }
                }
            });
        }
    }
})

// yyyy-dd-mm
.directive('valueValidatorF', function($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var flag = attrs.valueValidatorC;
            var reg, msg;
            if (flag == '1') {
                reg = /^\d\d\d\d-\d\d-\d\d$/;
                msg = '僅能輸入：YYYY-MM-DD(選擇填寫)';
            } else {
                reg = /^\d\d\d\d-\d\d-\d\d$/;
                msg = '僅能輸入：YYYY-MM-DD(選擇填寫)';
            }
            elm.blur(function(e) {
                e.target.value = e.target.value.trim();
                if(e.target.value.length > 0){
                    if (e.target.value.match(reg) != null || e.target.value == '') {
                        if((new Date(e.target.value)).toJSON() == null){
                            alert(msg);
                            elm.focus();
                        };
                        //
                    } else {
                        alert(msg);
                        elm.focus();
                    }
                }
            });
        }
    }
})

// not allow wrap
.directive('notAllowWrap', function($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            elm.keypress(function(event) {
                if (event.keyCode == 13) {
                    event.preventDefault();
                }
            });
        }
    }
})

.directive('ssdUserCombobox', function() {
    return {
        restrict: 'E',
        controller: ['$scope', '$rootScope', '$element', 'UserManage',
            function($scope, $rootScope, $element, UserManage) {
                $scope.value = 'Select User';
                $scope.on_loading = false;
                $scope.users = [];

                var offset;
                var limit;
                var total;

                // init users
                var load_data = function() {
                    UserManage.get({
                        offset: offset * limit,
                        limit: limit
                    }, function(data, status, headers, config) {
                        $scope.users = $scope.users.concat(data.objects);
                        total = data.meta.total_count;
                        $scope.on_loading = false;
                    }, function(data, status, headers, config) {
                        $scope.go_error(status, data.error || 'Ajax loading fail.');
                        $scope.on_loading = false;
                        offset -= 1;
                    });
                }

                // scroll back to top then hide self.
                $scope.hide_dropdownMenu = function(callback) {
                    $element.find('div.dropdownMenu').scrollTop(0);
                    $element.find('div.dropdownMenu').hide(10, callback, false);
                };

                // scroll to bottom
                $scope.on_scroll_changed = function(_event) {
                    var el = $element.find('div.dropdownMenu');

                    if ((el.scrollTop() + el.height()) >= el[0].scrollHeight - 200) {

                        if (!$scope.on_loading && $scope.users.length < total) {
                            $scope.on_loading = true;
                            offset += 1;
                            load_data();
                        }
                    }
                };

                // constructor
                $scope.init = function() {
                    $scope.value = 'Select User';
                    $scope.on_loading = false;
                    offset = 0;
                    limit = 200;
                    total = null;
                    $scope.users = [];
                    $scope.hide_dropdownMenu();

                    // detect bottom scroll arrived
                    $element.find('div.dropdownMenu').bind('scroll', $scope.on_scroll_changed);
                };
                $scope.init();

                $scope.toggleMenu = function() {
                    $element.find('div.dropdownMenu').toggle(120);
                }

                $scope.set_user = function(value) {
                    $element.find('div.dropdownMenu').unbind('scroll', $scope.on_scroll_changed);
                    $scope.value = value;
                    $scope.hide_dropdownMenu(function() {
                        $element.find('div.dropdownMenu').bind('scroll', $scope.on_scroll_changed);
                    });

                    $scope.formAdd.user_id = $scope.value;
                };

                // for reset dropdownMenu
                $rootScope.resetSSDUserCombobox = function() {
                    $scope.init();
                    load_data();
                }
            }
        ],
        templateUrl: '/views/combobox_component.html'
    };
})

.directive('ssdAlert', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: '/views/alert.html',
        controller: ['$scope', '$element',
            function($scope, $element) {
                $scope.close = function() {
                    $('#alert').modal('toggle');
                }
            }
        ]
    };
})

// faq
.directive('faqQuery', function() {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/views/faq/_faq_query.html',
    };
})
.directive('faqMaintenance', function() {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/views/faq/_faq_maintenance.html',
    };
})
.directive('faqTypeMaintenace', function() {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/views/faq/_faq_type_maintenace.html',
    };
})
.directive('faqMove', function() {
    return {
        restrict: 'E',
        scope: false,
        templateUrl: '/views/faq/_faq_move.html',
    };
})

// product approve
.directive('productApprove', function() {
    return {
        replace: true,
        restrict: 'E',
        templateUrl: '/views/product/onstore_manage/_product_approve.html'
    }
})

// product preview
.directive('productPreview', function() {
    return {
        replace: true,
        restrict: 'E',
        templateUrl: '/views/product/onstore_manage/_product_preview.html'
    }
})

// package approve
.directive('packageApprove', function() {
    return {
        replace: true,
        restrict: 'E',
        templateUrl: '/views/product/onstore_manage/_package_approve.html'
    }
})

// package preview
.directive('packagePreview', function() {
    return {
        replace: true,
        restrict: 'E',
        templateUrl: '/views/product/onstore_manage/_package_preview.html'
    }
})

// topup approve
.directive('topupApprove', function() {
    return {
        replace: true,
        restrict: 'E',
        templateUrl: '/views/product/onstore_manage/_topup_approve.html'
    }
})

// topup preview
.directive('topupPreview', function() {
    return {
        replace: true,
        restrict: 'E',
        templateUrl: '/views/product/onstore_manage/_topup_preview.html'
    }
})
.directive('baseControlPanel', function() {
    return {
        replace: true,
        transclude: true,
        restrict: 'E',
        templateUrl: '/views/product/onstore_manage/_base_control_panel.html'
    }
})

// product, package, topup approve list control panel
.directive('controlPanel', function() {
    return {
        replace: false,
        restrict: 'E',
        templateUrl: '/views/product/onstore_manage/_control_panel.html'
    }
})

// packageManage
.directive('controlPanelForPackageManage', function() {
    return {
        replace: false,
        restrict: 'E',
        templateUrl: '/views/product/_package_control_panel.html'
    }
})

// productManage
.directive('controlPanelForProductManage', function() {
    return {
        replace: false,
        restrict: 'E',
        templateUrl: '/views/product/_product_control_panel.html'
    }
})

// topupManage
.directive('controlPanelForTopupManage', function() {
    return {
        replace: false,
        restrict: 'E',
        templateUrl: '/views/product/_topup_control_panel.html'
    }
})

// .directive('parseInt', function () {
//   return {
//     restrict: 'A',
//     require: 'ngModel',
//     link: function (scope, elem, attrs, controller) {
//       controller.$formatters.push(function (modelValue) {
//         console.log('model', modelValue, typeof modelValue);
//         return '' + modelValue;
//       });

//       controller.$parsers.push(function (viewValue) {
//         console.log('view', viewValue, typeof viewValue);
//         return parseInt(viewValue, 10);
//       });
//     }
//   }
// })
;