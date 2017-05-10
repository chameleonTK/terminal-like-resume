angular.module('ngterminal')
.directive("terminal",[
    "$sce", 
    "$q",
    "$interval",
    "$document",
    "$timeout",
    "$location",
    "$anchorScroll",
    "Command",
function($sce, $q, $interval, $document, $timeout, $location, $anchorScroll, Command){

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
            vm.commandHistory = [""];
            vm.commandHistoryPointer = 0;

            scope.plainText = [""]
            scope.lines = [""];

            init();
            function init(){
                var d = new Date();
                var init_text = vm.options.init_text.slice(0);
                init_text.push("Last login : "+d.toUTCString()+" on ttys001");
                init_text.push("");
                init_text.push("*** TYPE `man` to see all aviable commands ***");

                terminalAutoWriteTexts(init_text)
                .then(function(){
                    return terminalAutoWrite("cat README.md", true)
                }).then(function(){
                    vm.command = "cat README.md";
                    keyDown({
                        keyCode:13,
                        preventDefault:function(){}
                    })
                });

                
            }

            function terminalName(){
                return vm.options.terminal_name+":~$ ";
            }

            function newLine(){
                scope.plainText.push("")
                scope.lines.push("")
                vm.currentIndex++;
                scrolldown(vm.currentIndex)
            }

            function terminalAutoWriteTexts(texts){
                var writePromise = texts.reduce(function(acc, text){
                    return acc.then(function(){
                        return terminalAutoWrite(text);
                    })
                }, $q.resolve());

                return writePromise.then(function(){
                    return terminalAutoWrite(terminalName(), true);
                })
            }

            function terminalAutoWrite(text, nonewline){
                vm.typerAviable = false;
                return $q(function(resolve, reject){
                    var index = 0;
                    $interval(function(){
                        if (index>=text.length) {
                            if (!nonewline) {
                                newLine();
                            }
                            vm.typerAviable = true;
                            resolve();
                        } else {
                            terminalWriteChar(text[index]);
                        }
                        index++;
                    }, vm.options.write_delay, text.length+1)
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


            function scrolldown(commandIndex){
                var newHash = "command-"+commandIndex
                if ($location.hash() !== newHash) {
                    $location.hash(newHash);
                } else {
                    $anchorScroll();
                }
            }

            function keyDown(event) {
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
                        if (vm.typerAviable) {
                            $timeout(function(){
                                
                            })
                        }
                        event.preventDefault();
                        return true;
                    }
                    case 13: {
                        //enter
                        if (vm.typerAviable) {
                            $timeout(function(){
                                newLine();

                                if (vm.command) {
                                    var args = vm.command
                                                .split(" ")
                                                .filter(function(str){ 
                                                    return str;
                                                })

                                    var command = args.shift();

                                    /// update command history
                                    vm.commandHistory[vm.commandHistory.length-1] = vm.command;
                                    vm.commandHistory.push("");
                                    vm.commandHistoryPointer = vm.commandHistory.length-1;

                                    Command.execute(command, args)
                                    .then(function(resp){
                                        terminalAutoWriteTexts(resp.messages)
                                    });

                                    vm.command = ""; 
                                } else {
                                    terminalAutoWrite(terminalName(), true);
                                }
                            })
                        }
                        event.preventDefault();
                        return true;
                    }
                    case 38: {
                        // up
                        if (vm.typerAviable) {
                            if (vm.commandHistoryPointer > 0) {
                                $timeout(function(){
                                    vm.commandHistoryPointer--;
                                    vm.command = vm.commandHistory[vm.commandHistoryPointer];
                                    terminalReplace(terminalName()+vm.commandHistory[vm.commandHistoryPointer]);
                                })
                            }
                        }

                        event.preventDefault();
                        return true;
                    }
                    case 40: {
                        // down
                        if (vm.typerAviable) {
                            console.log(vm.commandHistory);
                            if (vm.commandHistoryPointer < vm.commandHistory.length-1) {
                                $timeout(function(){
                                    vm.commandHistoryPointer++;
                                    vm.command = vm.commandHistory[vm.commandHistoryPointer];
                                    terminalReplace(terminalName()+vm.commandHistory[vm.commandHistoryPointer]);
                                })
                            }
                        }
                        event.preventDefault();
                        return true;
                    }
                    default:
                        return true;
                }
            }

            function keyPress (event) {
                if (vm.typerAviable) {
                    $timeout(function(){
                        terminalWriteChar(event.key)
                        vm.command += event.key;
                    })
                    event.preventDefault();
                }
            }

            $document.bind('keydown', keyDown);
            $document.bind('keypress', keyPress);
        }
    }
}]);
