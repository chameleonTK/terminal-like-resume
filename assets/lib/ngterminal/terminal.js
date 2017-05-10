angular.module('ngterminal')
.directive("terminal",[
    "$sce", 
    "$q",
    "$interval",
    "$document",
    "$timeout",
    "Command",
function($sce, $q, $interval, $document, $timeout, Command){

    var vm = this;
    return {
        scope:{},
        templateUrl: "templates/terminal.html",
        link:function(scope){
            vm.options = {
                "write_delay":10,
                "init_text":[],
                "terminal_name":"imtk@curveinth"
            }

            vm.currentIndex = 0;
            vm.writePromise = $q.resolve();
            vm.typerAviable = false;
            vm.command = "";

            scope.plainText = [""]
            scope.lines = [""];

            init();
            function init(){
                var d = new Date();
                var init_text = vm.options.init_text.slice(0);
                init_text.push("Last login : "+d.toUTCString()+" on ttys001");

                vm.writePromise = init_text.reduce(function(acc, text){
                    return acc.then(function(){
                        return terminalAutoWrite(text);
                    })
                }, $q.resolve());

                vm.writePromise.then(function(){
                    return terminalAutoWrite(terminalName(), true);
                }).then(function(){
                    vm.typerAviable = true;
                })
                
            }

            function terminalName(){
                return vm.options.terminal_name+":~$ ";
            }

            function newLine(){
                scope.plainText.push("")
                scope.lines.push("")
                vm.currentIndex++;
            }

            function terminalAutoWrite(text, nonewline){
                vm.typerAviable = false;
                return $q(function(resolve, reject){
                    var index = 0;
                    $interval(function(){
                        terminalWriteChar(text[index]);
                        index++;

                        if (index>=text.length) {
                            if (!nonewline) {
                                newLine();
                            }
                            vm.typerAviable = true;
                            resolve();
                        }

                    }, vm.options.write_delay, text.length)
                })
            }

            function terminalWriteChar(char){
                scope.plainText[vm.currentIndex] += escapeHTML(char)
                scope.lines[vm.currentIndex] = $sce.trustAsHtml(scope.plainText[vm.currentIndex]);
            }

            function terminalDelChar(noTerminalName){
                var line = scope.plainText[vm.currentIndex];
                // 9 is offet for ":~$ "
                if (!noTerminalName) {
                    if (line.length <= vm.options.terminal_name.length+9){
                        return false;
                    }
                }

                if (line[line.length-1]==";") {
                    while (line[line.length-1]!="&") {
                        line = line.slice(0, -1);
                        scope.plainText[vm.currentIndex] = line;
                        scope.lines[vm.currentIndex] = $sce.trustAsHtml(line);
                    }
                    scope.plainText[vm.currentIndex] = line.slice(0, -1);
                    scope.lines[vm.currentIndex] = $sce.trustAsHtml(scope.plainText[vm.currentIndex]);
                } else {
                    scope.plainText[vm.currentIndex] = line.slice(0, -1);
                    scope.lines[vm.currentIndex] = $sce.trustAsHtml(scope.plainText[vm.currentIndex]);
                }
            }

            function terminalReplace(str){
                scope.plainText[vm.currentIndex] = str;
                scope.lines[vm.currentIndex] = $sce.trustAsHtml(scope.plainText[vm.currentIndex]);
            }

            function escapeHTML(char){
                switch(char) {
                    case " ":
                        return "&nbsp;";
                    case "\"":
                        return "&quot;"
                    case "<":
                        return "&lt;"
                    case ">":
                        return "&gt;"
                    case "&":
                        return "&amp;"
                    case ";":
                        return "&#59;"
                    default:
                        return char;
                }
            }

            $document.bind('keydown', function (event) {
                switch(event.keyCode) {
                    case 8: {
                        // backspace
                        if (vm.typerAviable) {
                            $timeout(function(){
                                terminalDelChar()
                                vm.command = vm.command.slice(0, -1);
                            })
                        }
                        event.preventDefault();
                        return true;
                    }
                    case 9: {
                        // tab
                        event.preventDefault();
                        return true;
                    }
                    case 13: {
                        if (vm.typerAviable) {
                            $timeout(function(){
                                newLine();
                                terminalAutoWrite(terminalName(), true);
                                Command.execute(vm.command);
                                vm.command = "";
                            })
                        }
                        event.preventDefault();
                        return true;
                    }
                    case 38: {
                        // up
                        event.preventDefault();
                        return true;
                    }
                    case 40: {
                        // down
                        event.preventDefault();
                        return true;
                    }
                    default:
                        return true;
                }
            });

            $document.bind('keypress', function (event) {
                if (vm.typerAviable) {
                    $timeout(function(){
                        terminalWriteChar(event.key)
                        vm.command += event.key;
                    })
                    event.preventDefault();
                }
            });
            
            
            // target.on("keypress", function (e) {
            //     if(scope.showPrompt || scope.allowTypingWriteDisplaying)
            //         scope.keypress(e.which);
            
            // });

            // target.on("keydown", function (e) {

            
            // });
        }
    }
}]);
