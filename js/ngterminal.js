angular.module('ngterminal', [])
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

angular.module('ngterminal')
.factory('Files', ["$q", function($q){

    var files = [
        {"name":"blog", "type":"folder", "size":"29k"},
        {"name":"contact.txt", "type":"file", "size":"32"},
        {"name":"experiences.txt", "type":"file", "size":"1k"},
        {"name":"man", "type":"file", "size":"292"},
        {"name":"twitter", "type":"folder", "size":"430"},
        {"name":"README.md", "type":"file", "size":"3723"},
    ];

    return {
        getFiles:getFiles,
        read:read
    }

    function read(filename){
        var file = files.find(function(file){
            return file.type=="file" && file.name==filename
        })

        if (!file) {
            return false;
        }

        if (file.name=="README.md") {
            return [
                "Hi, I'm Pakawat Nakwijit.",
                " ",
                "I graduated in Computer Engineering, Kasetsart University. ",
                "I develop an interest in Programming Languages, NLP and AI.",
                "However, you also can talk to me about movies, adventure trips, and cat.",
                " ",
                "Now, I am working as a web developer at Maxile co.,ltd and ",
                "writing a blog about whatever I am interested especially about cats.",
                " ",
                "If you would like to get in touch with me, whether it be for technical issue, or to just say hi, ",
                "don't heritage to send me an email or a tweet.",
                " ",
                "my email : pakawat.nk@gmail.com",
                "my twitter : @chameleontk",
                " ",
                "And learn more about me at http://wp.curve.in.th",
            ]
        } else if (file.name=="contact.txt"){
            return [
                "email : pakawat.nk@gmail.com",
                "twitter : @chameleontk",
                " ",
                "And learn more about me at http://wp.curve.in.th",
            ]
        } else if (file.name=="experiences.txt"){
            return [
                "2016 - present",
                "Software Developer at Maxile co.,ltd.",
                "  - CMS for website http://www.1for100.or.th",
                " ",
                "  - Ionic application: e-Tracking",
                "    Application for tracking import/export document's status",
                " ",
                "  - Neekrung Magazine http://www.neekrung.com",
                "    implemented a responsive website for Neekrung magazines.",
                " ",
                "  - eBMN project http://ebmn.cdd.go.th",
                "    An online census form which need to handle more than million of data records.",
                " ",
                "Freelance",
                "  - Curator at TEDxKasetsartU",
                "    curated speakers to build an interesting talk at TEDx conference",
                " ",
                "  - Attended DevFest Hackathon 2016 ",
                "    as '25 Finalists' with Khunkrukanoomping – An intelligent teacher(chatbot) on LINE platform",
                " ",
                "  - Developed FrontEnd http://www.petpolar.com",
                "    A social network focusing on pet lover. I work on frontend development including web site animation, ",
                "    user interface and social feature.",
                " ",
                "  - Waste challenge Game on website http://www.wastechallenge.com",
                "    participate with WWF&Hilton for awareness campaign on waste segregation. ",
                "    It's a game that user have to choose the right type of 20 waste in 1 minute.",
                " ",
                "2015",
                "  - Published a research paper in ICSEC 2015, Chiangmai, Thailand",
                "    'A Parser Generator Using the Grammar Flow Graph'. An easier parser generator works for context-free language with acceptable performance.",
                " ",
                "  - Antikopae Project with Dr.Paruj Ratanaworabhan",
                "    worked on Clone detection system for investigating research documents.",
                " ",
                "2014",
                "  - Internship student at NIST, Nara, Japan",
                "    researched about code refactoring in Software Design and Analysis Laboratory",
                " ",
                "  - Asuku Project",
                "    An artificial intelligence conversation application use learning model from data in http://www.ask.fm",
                " ",
                "2011 - 2013",
                "  - Teaching Assistant for Computer and Programming, Compiler,",
                "    Computer Architecture and Microprocessor",
                " ",
                "  - Kasetsart University Medal of Honor Recipient: 2011, 2012, 2013",
                " ",
                "  - Treasurer of Computer Engineering’s Student Body Organization",
                " ",
                "  - Organizer and Master of Ceremony in many activies such as Toktakcamp, Konnec#6, eXceed Camp",
                "    training camp for sophomore&junior student at Kasetsart University",
                " ",
                "  - Attended 11th Young Webmaster Camp",
                "    recieced honor for the best creative website (Punmap.com)",
                " ",
                "  - Speaker in Barcamp Bangkok and Barcamp Bangkhen",
                "    'Scratch ง่ายๆ ใน 1 นาที' in Barcamp Bangkhen 4, 2013; ",
                "    'Phalcon # The fastest PHP Framework' in Barcamp Bangkok 2014 ",
                "    'Robot 1st Times' in Barcamp Bangkhen 5, 2014;",
                "    'มาเป็นทาสแมวกันเถอะ' in Barcamp Bangkhen 6,2015;",
                " ",
                "  - Exhibited at Google I/O 2013, Thailand",
                " ",
            ]
        } else if (file.name=="man"){
            return [
                "Common commands:",
                "    ls  [-al] [folder]   list directory contents",
                "    cd  [folder]         change directory",
                "    cat [file]           concatenate and print files",
                "    man                  format and display the on-line manual pages",
                " ",
                "For help on any individual command run tweet to me at @chameleontk",
            ]
        }

        return [];
    }

    function getFiles(){
        return files;
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
        }
    }
}]);
