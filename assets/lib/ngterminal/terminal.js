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
    "Writer",
function($sce, $q, $interval, $document, $timeout, $location, $anchorScroll, Command, Writer){

    var vm = this;
    return {
        scope:{},
        templateUrl: "templates/terminal.html",
        link:function(scope){
            vm.options = {
                "write_delay":10,
                "init_text":[],
                "terminal_name":"imtk@curveinth",
                "scope":scope
            }

            vm.writer = null;
            scope.plainText = [""]
            scope.lines = [""];

            vm.command = "";
            vm.commandHistory = [""];
            vm.commandHistoryPointer = 0;

            init();
            function init(){
                var d = new Date();
                var init_text = vm.options.init_text.slice(0);
                init_text.push("Last login : "+d.toUTCString()+" on ttys001");
                init_text.push("");
                init_text.push("*** TYPE `man` to see all aviable commands ***");

                vm.writer = new Writer(vm.options);
                vm.writer.terminalAutoWriteTexts(init_text)
                .then(function(){
                    return vm.writer.terminalAutoWrite("cat README.md", true)
                }).then(function(){
                    vm.command = "cat README.md";
                    keyDown({
                        keyCode:13,
                        preventDefault:function(){}
                    })
                });

                
            }

            function keyDown(event) {
                switch(event.keyCode) {
                    case 8: {
                        // backspace
                        if (vm.writer.aviable()) {
                            $timeout(function(){
                                vm.writer.terminalDelChar()
                                vm.command = vm.command.slice(0, -1);        
                            })
                        }

                        event.preventDefault();
                        return true;
                    }
                    case 9: {
                        // tab
                        if (vm.writer.aviable()) {
                            $timeout(function(){
                                
                            })
                        }
                        event.preventDefault();
                        return true;
                    }
                    case 13: {
                        //enter
                        if (vm.writer.aviable()) {
                            $timeout(function(){
                                vm.writer.newLine();

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
                                        vm.writer.terminalAutoWriteTexts(resp.messages)
                                    });

                                    vm.command = ""; 
                                } else {
                                    vm.writer.terminalAutoWrite(vm.writer.terminalName(), true);
                                }
                            })
                        }
                        event.preventDefault();
                        return true;
                    }
                    case 38: {
                        // up
                        if (vm.writer.aviable()) {
                            if (vm.commandHistoryPointer > 0) {
                                $timeout(function(){
                                    vm.commandHistoryPointer--;
                                    vm.command = vm.commandHistory[vm.commandHistoryPointer];
                                    vm.writer.terminalReplace(vm.writer.terminalName()+vm.commandHistory[vm.commandHistoryPointer]);
                                })
                            }
                        }

                        event.preventDefault();
                        return true;
                    }
                    case 40: {
                        // down
                        if (vm.writer.aviable()) {
                            if (vm.commandHistoryPointer < vm.commandHistory.length-1) {
                                $timeout(function(){
                                    vm.commandHistoryPointer++;
                                    vm.command = vm.commandHistory[vm.commandHistoryPointer];
                                    vm.writer.terminalReplace(vm.writer.terminalName()+vm.commandHistory[vm.commandHistoryPointer]);
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
                if (vm.writer.aviable()) {
                    $timeout(function(){
                        vm.writer.terminalWriteChar(event.key)
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
