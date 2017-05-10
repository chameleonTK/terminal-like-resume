
    $scope.init('default');

    var commandHistory = [];
    var commandIndex = -1;   

    $scope.handlePaste = function (e) {
        $scope.commandLine += e.clipboardData.getData('text/plain');
        $scope.$$phase || $scope.$apply();
    };

    $scope.$on('terminal-output', function (e, output) {
        if (!output.added) {
            output.added = true;
            $scope.results.push(output);
        }
    });

    $scope.$on('terminal-command', function (e, cmd) {
        if (cmd.command =='clear') {
            $scope.results.splice(0, $scope.results.length);
            $scope.$$phase || $scope.$apply();
        }
        else if (cmd.command == 'change-prompt') {
            if (cmd.prompt) {
                if (cmd.prompt.user)
                    $scope.prompt.user(cmd.prompt.user);
                if (cmd.prompt.path)
                    $scope.prompt.path(cmd.prompt.path);
                $scope.$$phase || $scope.$apply();
            }
        }
        else if (cmd.command == 'reset-prompt') {
            var resetAll = true;
            if (cmd.prompt) {
                if (cmd.prompt.user) {
                    $scope.prompt.resetUser();
                    resetAll = false;
                }
                else if (cmd.prompt.path) {
                    $scope.prompt.resetPath();
                    resetAll = false;
                }
            }
            if(resetAll)
                $scope.prompt.reset();
            $scope.$$phase || $scope.$apply();
        }
    });
       
    $scope.keypress= function (keyCode) {
        if ($scope.commandLine.length < 80) {
            commandIndex = -1;
            $scope.commandLine += String.fromCharCode(keyCode);
            $scope.$$phase || $scope.$apply();
        }
    };

    $scope.previousCommand = function () {
        if (commandIndex == -1) {
            commandIndex = commandHistory.length;
        }

        if(commandIndex == 0)
            return;

        $scope.commandLine = commandHistory[--commandIndex];
        $scope.$$phase || $scope.$apply();
    }

    $scope.nextCommand = function () {
        if (commandIndex == -1) {
            return;
        }

        if (commandIndex < commandHistory.length - 1) {
            $scope.commandLine = commandHistory[++commandIndex];
            $scope.$$phase || $scope.$apply();
        }
        else {
            $scope.commandLine = '';
            $scope.$$phase || $scope.$apply();
        }
    }

    var cleanNonPrintableCharacters = function (input) {
        return input.replace(re, '');
    };
    
    $scope.execute = function () {
        var command = cleanNonPrintableCharacters($scope.commandLine);

        $scope.commandLine = '';

        if (!command)
            return;

        if (commandHistory.length > 10) {
            commandHistory.splice(0, 1);
        }
        
        if(command != commandHistory[commandHistory.length-1])
            commandHistory.push(command);

        $scope.results.push({ type: 'text', text:[$scope.prompt.text + command] });
        $scope.$emit('terminal-input', [{ command: command }]);
        
        $scope.$apply();
    };

    $scope.backspace = function () {
        if ($scope.commandLine) {
            $scope.commandLine = $scope.commandLine.substring(0, $scope.commandLine.length - 1);
            $scope.$apply();
        }
    }


.directive('terminal', function ($document) {
    return {
        restrict: 'E',
        controller: 'terminalController',
        transclude: true,
        replace:true,
        template: "<section class='terminal' ng-paste='handlePaste($event)'><div class='terminal-viewport'><div class='terminal-results'></div><span class='terminal-prompt' ng-show='showPrompt'>{{prompt.text}}</span><span class='terminal-input'>{{commandLine}}</span><span class='terminal-cursor'>_</span><input type='text' ng-model='commandLine' class='terminal-target'/></div><div ng-transclude></div></section>",
        compile: function compile(tElement, tAttrs, transclude) {
            return {
                pre: function preLink(scope, element, attrs, controller) {
                   
                },
                post: function postLink(scope, element, attrs, controller) { 

                        var terminal = element;
                        var target = angular.element(element[0].querySelector('.terminal-target'));
                        var consoleView = angular.element(element[0].querySelector('.terminal-viewport'));
                        var results = angular.element(element[0].querySelector('.terminal-results'));
                        var prompt = angular.element(element[0].querySelector('.terminal-prompt'));
                        var cursor = angular.element(element[0].querySelector('.terminal-cursor'));
                        var consoleInput = angular.element(element[0].querySelector('.terminal-input'));
            
                        if(navigator.appVersion.indexOf("Trident") != -1){
                            terminal.addClass('damn-ie');
                        }

                        var css = attrs['terminalClass'];
                        if (css) {
                            terminal.addClass(css);
                        }

                        var config = attrs['terminalConfig'];
                        scope.init(config || 'default');
                                                            
                        setInterval(function () {
                            var focused = $document[0].activeElement == target[0];
                            if (focused) {
                                cursor.toggleClass('terminal-cursor-hidden');
                            }
                            else if (!target.hasClass('terminal-cursor-hidden'))
                                cursor.addClass('terminal-cursor-hidden');
                        }, 500);

                        var mouseover = false;
                        element.on('mouseover', function () {
                            mouseover = true;
                        });
                        element.on('mouseleave', function () {
                            mouseover = false;
                        });

                        consoleView.on('click', function () {
                            target[0].focus();
                            terminal.toggleClass('terminal-focused', true);
                        });

                        target.on("blur", function (e) {
                            if(!mouseover)
                                terminal.toggleClass('terminal-focused', false);
                        });

                        target.on("keypress", function (e) {
                            if(scope.showPrompt || scope.allowTypingWriteDisplaying)
                                scope.keypress(e.which);
                            e.preventDefault();
                        });

                        target.on("keydown", function (e) {

                            if (e.keyCode == 9) {
                                e.preventDefault();
                            }
                            if (e.keyCode == 8) {
                                if (scope.showPrompt || scope.allowTypingWriteDisplaying)
                                    scope.backspace();
                                e.preventDefault();
                            }
                            else if (e.keyCode == 13) {
                                if (scope.showPrompt || scope.allowTypingWriteDisplaying)
                                    scope.execute();
                            }
                            else if (e.keyCode == 38) {
                                if (scope.showPrompt || scope.allowTypingWriteDisplaying)
                                    scope.previousCommand();
                                e.preventDefault();
                            }
                            else if (e.keyCode == 40) {
                                if (scope.showPrompt || scope.allowTypingWriteDisplaying)
                                    scope.nextCommand();
                                e.preventDefault();
                            }
                        });

                        function type(input, line, i, endCallback) {
                            setTimeout(function () {
                                scope.typeSound();
                                input.textContent += (i<line.length?line[i]:'');

                                if (i < line.length - 1) {
                                    scope.typeSound();
                                    type(input, line, i + 1, endCallback);
                                }
                                else if (endCallback)
                                    endCallback();
                            }, scope.outputDelay);
                        }

                        scope.$watchCollection(function () { return scope.results; }, function (newValues, oldValues) {
                
                            if (oldValues.length && !newValues.length) { // removal detected
                                var children = results.children();
                                for (var i = 0; i < children.length; i++) {
                                    children[i].remove();
                                }
                            }

                            scope.showPrompt = false;
                            var f = [function () {
                                scope.showPrompt = true;
                                scope.$$phase || scope.$apply();
                                consoleView[0].scrollTop = consoleView[0].scrollHeight;
                            }];

                            for (var j = 0; j < newValues.length; j++) {

                                var newValue = newValues[j];
                                if (newValue.displayed)
                                    continue;

                                newValue.displayed = true;

                                if (scope.outputDelay) {

                                    for (var i = newValue.text.length - 1; i >= 0; i--) {
                                        var line = document.createElement('pre');
                                        line.className = 'terminal-line';

                                        var textLine = newValue.text[i];

                                        if (scope.outputDelay && newValue.output) {
                                            line.textContent = '  ';
                                            var fi = f.length - 1;
                                            var wrapper = function () {
                                                var wline = line;
                                                var wtextLine = textLine;
                                                var wf = f[fi];
                                                var wbreak = i == newValue.text.length - 1 && newValue.breakLine;
                                                f.push(function () {
                                                    results[0].appendChild(wline); type(wline, wtextLine, 0, wf);
                                                    consoleView[0].scrollTop = consoleView[0].scrollHeight;
                                                    if (wbreak) {
                                                        var breakLine = document.createElement('br');
                                                        results[0].appendChild(breakLine);
                                                    }
                                                });
                                            }();
                                        }
                                        else {
                                            line.textContent = textLine;
                                            results[0].appendChild(line)
                                        }
                                    }
                                }
                                else {
                                    for (var i = 0; i < newValue.text.length; i++) {
                                        var line = document.createElement('pre');
                                        line.textContent = newValue.output?'  ':'';
                                        line.className = 'terminal-line';
                                        line.textContent += newValue.text[i];
                                        results[0].appendChild(line)
                                    }
                                    if (!!newValue.breakLine) {
                                        var breakLine = document.createElement('br');
                                        results[0].appendChild(breakLine);
                                    }
                                }
                    
                            }
                            f[f.length - 1]();
                        });

                }
            }
        }
    }
})
;
