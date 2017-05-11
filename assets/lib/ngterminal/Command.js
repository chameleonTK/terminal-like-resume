angular.module('ngterminal')
.factory('Command', [
    "$q", 
    "Files", 
    "$window",
function($q, Files, $window){

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
                        "messages":["ls: Not support multiple files"]
                    }
                }

                var file = Files.getFiles().find(function(file){
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
            var messages = Files.getFiles().reduce(function(acc, file){
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
            var messages = Files.getFiles().reduce(function(acc, file){
                acc.push(file.name)
                return acc;
            }, [])

            return {
                "successful":true,
                "messages":messages
            };
        } else {
            var half = Math.ceil(Files.getFiles().length/2);
            var messages = Files.getFiles().reduce(function(acc, file, index){
                if (index<half){
                    acc.push(file.name);
                } else {
                    while (acc[index-half].length < 18) {
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

    function commandcat(cmd, args){
        if (args.length==1) {
            var contents = Files.read(args[0]);
            if (contents===false) {
                return {
                    "successful":false,
                    "messages":["cat: "+args[0]+": No such file or directory"]
                }
            } else {
                return {
                    "successful":true,
                    "messages":contents
                }
            }
            
        } else {
            if (args.length>1) {
                return {
                    "successful":false,
                    "messages":["cat: Not support multiple files"]
                }
            } else {
                return {
                    "successful":false,
                    "messages":["cat: Invalid arguments"]
                }
            }
        }
    }

    function commandman(cmd, args){
        var contents = Files.read("man");
        return {
            "successful":true,
            "messages":contents
        }
    }

    function commandcd(cmd, args){
        if (args.length==1) {

            var file = Files.getFiles().find(function(file){
                return file.type=="folder" && file.name==args[0]
            })

            if (!file) {
                return {
                    "successful":false,
                    "messages":["cd: "+args[0]+": No such file or directory"]
                }
            }

            if (file.name=="blog") {
                $window.open("http://wp.curve.in.th", '_blank');
            } else if (file.name=="twitter") {
                $window.open("https://twitter.com/ChameleonTK", '_blank');
            }

            return {
                "successful":true,
                "messages":[]
            }
        } else {
            if (args.length>1) {
                return {
                    "successful":false,
                    "messages":["cd: Not support multiple files"]
                }
            } else {
                return {
                    "successful":false,
                    "messages":["cd: Invalid arguments"]
                }
            }
        }
    }

    function execute(cmd, args){
        return $q(function(resolve, reject){
            switch(cmd) {
                case "ls": {
                    resolve(commandls(cmd, args))
                    return true;
                }
                case "cat": {
                    resolve(commandcat(cmd, args))
                    return true;
                }
                case "man": {
                    resolve(commandman(cmd, args))
                    return true;
                }
                case "help": {
                    resolve(commandman(cmd, args))
                    return true;
                }
                case "hi": {
                    resolve({ successful:true,messages:["Hi, How are you?"]})
                    return true;
                }
                case "say": {
                    resolve({ successful:true,messages:args})
                    return true;
                }
                case "echo": {
                    resolve({ successful:true,messages:args})
                    return true;
                }
                case "cd": {
                    resolve(commandcd(cmd, args))
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
