angular.module('ngterminal', [])
angular.module('ngterminal')
.factory('Command', ["$q", function($q){

    var files = [
        {"name":"blog", "type":"folder", "size":"29k"},
        {"name":"contact.txt", "type":"file", "size":"32"},
        {"name":"profile.txt", "type":"file", "size":"2"},
        {"name":"twitter", "type":"folder", "size":"430"},
        {"name":"README.md", "type":"file", "size":"3723"},
    ];

    return {
        execute:execute
    }

    function commandls(cmd, args){
        if (args.length>0){
            if (args[0].length>0 && args[0][0]=="-") {
                var aflag = args[0].split("").find(function(option){
                    return option=="a"
                })

                var lflag = args[0].split("").find(function(option){
                    return option=="l"
                })
            }

            var targetFile = args.find(function(arg){
                return arg.length>0 && arg[0]!="-"
            })

            if (targetFile) {
                console.log(targetFile, args[args.length-1]);
                if (targetFile!=args[args.length-1]) {
                    return {
                        "successful":false,
                        "messages":["ls: Not support list multiple files"]
                    }
                }

                var file = files.find(function(file){
                    return file.type=="folder" && file.name==targetFile
                })

                if (file) {
                    return {
                        "successful":true,
                        "messages":[]
                    };
                } else {
                    return {
                        "successful":false,
                        "messages":["ls: "+targetFile+": No such file or directory"]
                    }
                }
            }
        }

        if (lflag) {
            var messages = files.reduce(function(acc, file){
                var size = file.size;
                while(size.length<6){
                    size = " "+size;
                }

                if (file.type=="folder") {
                    acc.push("drw-r--r--   1 imtk  imtk       "+size+" Mar 10 00:00 "+file.name)
                } else {
                    acc.push("-rw-r--r--   1 imtk  imtk       "+size+" Mar 10 00:00 "+file.name)
                }
                return acc;
            }, [])

            return {
                "successful":true,
                "messages":messages
            };
        } else if (aflag){
            var messages = files.reduce(function(acc, file){
                acc.push(file.name)
                return acc;
            }, [])

            return {
                "successful":true,
                "messages":messages
            };
        } else {
            var half = Math.ceil(files.length/2);
            var messages = files.reduce(function(acc, file, index){
                if (index<half){
                    acc.push(file.name);
                } else {
                    while (acc[index-half].length < 14) {
                        acc[index-half]+=" ";
                    }

                    acc[index-half] += file.name;
                }

                return acc;
            }, [])

            return {
                "successful":true,
                "messages":messages
            };
        }
    }

    function execute(cmd, args){
        return $q(function(resolve, reject){
            switch(cmd) {
                case "ls": {
                    resolve(commandls(cmd, args))
                    return true;
                }
                default:{
                    resolve({
                        "successful":false,
                        "messages":[
                            "-bash: "+cmd+": command not found"
                        ]
                    })
                    return false;
                }
            }
        })
    }

    
}]);

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

            scope.plainText = [""]
            scope.lines = [""];

            init();
            function init(){
                var d = new Date();
                var init_text = vm.options.init_text.slice(0);
                init_text.push("Last login : "+d.toUTCString()+" on ttys001");
                terminalAutoWriteTexts(init_text);
                
                
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

                writePromise.then(function(){
                    return terminalAutoWrite(terminalName(), true);
                })
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


            function scrolldown(commandIndex){
                var newHash = "command-"+commandIndex
                if ($location.hash() !== newHash) {
                    $location.hash(newHash);
                } else {
                    $anchorScroll();
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
                        //enter
                        if (vm.typerAviable) {
                            $timeout(function(){
                                newLine();
                                var args = vm.command
                                            .split(" ")
                                            .filter(function(str){ 
                                                return str;
                                            })

                                var command = args.shift();
                                vm.typerAviable = false;

                                Command.execute(command, args)
                                .then(function(resp){
                                    terminalAutoWriteTexts(resp.messages)
                                });

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
