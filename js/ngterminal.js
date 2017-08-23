angular.module('ngterminal', [])
angular.module('ngterminal')
.factory('Command', [
    "$q", 
    "commandcat",
    "commandcd",
    "commandls",
    "commandman",
    "commandecho",
function($q, cat, cd, ls, man, echo){
    var vm = this;
    vm.commands = {}

    regis("cat", cat);
    regis("cd", cd);
    regis("ls", ls);
    regis("man", man);
    regis("echo", echo);
    regis("help", man);
    regis("say", echo);
    regis("hi", echo);

    return {
        execute:execute,
        regis:regis
    }

    function regis(cmd, service) {
        vm.commands[cmd] = service;
    }

    function execute(cmd, args){
        if (vm.commands.hasOwnProperty(cmd)) {
            return vm.commands[cmd].execute(cmd, args);
        } else {
            return $q(function(resolve, reject){
                resolve({
                    "successful":false,
                    "messages":[
                        "-bash: "+cmd+": command not found"
                    ]
                })
            })
        }
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
                "I have developed an interest in Programming Languages, NLP and AI since I was in university.",
                "However, you are welcome to discuss with me about movies, adventure, and cats.",
                " ",
                "Now, I am working as a web developer at Maxile co.,ltd and ",
                "writing a blog about whatever I am interested in especially about cats.",
                " ",
                "If you would like to get in touch with me, whether it be for technical issues, or to just say hi, ",
                "don't heritate to send me an email or a tweet.",
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
                "    implemented a responsive website for Neekrung magazine.",
                " ",
                "  - eBMN project http://ebmn.cdd.go.th",
                "    An online census form which is capable of keeping more than million of data records.",
                " ",
                "Freelance",
                "  - Curator at TEDxKasetsartU",
                "    curated speakers to build an interesting talk at TEDx conference",
                " ",
                "  - Attended DevFest Hackathon 2016 ",
                "    as '25 Finalists' with Khunkrukanoomping – An intelligent chatbot on LINE platform",
                " ",
                "  - Developed FrontEnd http://www.petpolar.com",
                "    An online community for pet lovers. I worked on frontend development including web site animation, ",
                "    user interface and social features.",
                " ",
                "  - Waste challenge Game on website http://www.wastechallenge.com",
                "    participated with WWF&Hilton for awareness campaign on waste segregation. ",
                "    It's a game which users are to choose the right category of 20 wastes in 1 minute.",
                " ",
                "2015",
                "  - Published a research paper in ICSEC 2015, Chiangmai, Thailand",
                "    'A Parser Generator Using the Grammar Flow Graph'. An easier parser generator works for context-free language with acceptable performance.",
                " ",
                "  - Antikopae Project with Dr.Paruj Ratanaworabhan",
                "    worked on investigation of plagiarism in research field.",
                " ",
                "2014",
                "  - Internship student at NIST, Nara, Japan",
                "    conducted a research about code refactoring in Software Design and Analysis Laboratory",
                " ",
                "  - Asuku Project",
                "    An artificial intelligence conversation application  which uses learning model from data in http://www.ask.fm",
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
                "    cat [file]           concatenate and print a file",
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
.factory('Writer', [
    "$q",
    "$location",
    "$anchorScroll",
    "$interval",
    "$sce",
function($q, $location, $anchorScroll, $interval, $sce){

    return function(options){
        var vm = this;
        vm.options = options;
        vm.terminalName = terminalName;
        vm.newLine = newLine;
        vm.terminalAutoWriteTexts = terminalAutoWriteTexts;
        vm.terminalAutoWrite = terminalAutoWrite;
        vm.terminalWriteChar = terminalWriteChar;
        vm.terminalDelChar = terminalDelChar;
        vm.terminalReplace = terminalReplace;
        vm.aviable = aviable;

        vm.currentIndex = 0;
        vm.typerAviable = false;

        var scope = options.scope;

        function terminalName(){
            return "<b>"+vm.options.terminal_name+":~$</b> ";
        }

        function newLine(){
            scope.plainText.push("")
            scope.lines.push("")
            vm.currentIndex++;
            scrolldown(vm.currentIndex)
        }

        function scrolldown(commandIndex){
            var newHash = "command-"+commandIndex
            if ($location.hash() !== newHash) {
                $location.hash(newHash);
            } else {
                $anchorScroll();
            }
        }

        function terminalAutoWriteTexts(texts){
            var writePromise = texts.reduce(function(acc, text){
                return acc.then(function(){
                    return terminalAutoWrite(text);
                })
            }, $q.resolve());

            return writePromise.then(function(){
                return terminalAutoWrite(terminalName(), true, true);
            })
        }

        function aviable(){
            return vm.typerAviable;
        }

        function terminalAutoWrite(text, nonewline, noescape){
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
                        terminalWriteChar(text[index], noescape);
                    }
                    index++;
                }, vm.options.write_delay, text.length+1)
            })
        }

        function terminalWriteChar(char, noescape){
            scope.plainText[vm.currentIndex] += noescape?char:escapeHTML(char);
            scope.lines[vm.currentIndex] = $sce.trustAsHtml(scope.plainText[vm.currentIndex]);
        }

        function getTerminalOffet(){
            // 9 is offet for ":~$ "
            return 11;
        }

        function terminalDelChar(noTerminalName){
            var line = scope.plainText[vm.currentIndex];
            if (!noTerminalName) {
                if (line.length <= vm.options.terminal_name.length+getTerminalOffet()){
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

    }
    
}]);

angular.module('ngterminal')
.directive("terminal",[
    "$sce", 
    "$q",
    "$document",
    "$timeout",
    "Command",
    "Writer",
function($sce, $q, $document, $timeout, Command, Writer){

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
                                    vm.writer.terminalAutoWrite(vm.writer.terminalName(), true, true);
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

angular.module('ngterminal')
.factory('commandcat', [
    "$q", 
    "Files", 
function($q, Files){

    return {
        execute:execute,
    }

    function run(cmd, args){
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

    function execute(cmd, args){
        return $q(function(resolve, reject){
            resolve(run(cmd, args))
            return true;
        })
    }

    
}]);

angular.module('ngterminal')
.factory('commandcd', [
    "$q", 
    "Files", 
    "$window",
function($q, Files, $window){

    return {
        execute:execute,
    }

    function run(cmd, args){
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
            resolve(run(cmd, args))
            return true;
        })
    }

    
}]);

angular.module('ngterminal')
.factory('commandecho', [
    "$q", 
function($q){

    return {
        execute:execute,
    }

    function run(cmd, args){
        if (cmd=="hi") {
            return {
                "successful":true,
                "messages":["Hi, How are you?"]
            }    
        }
        return {
            "successful":true,
            "messages":args
        }
    }

    function execute(cmd, args){
        return $q(function(resolve, reject){
            resolve(run(cmd, args))
            return true;
        })
    }

    
}]);

angular.module('ngterminal')
.factory('commandls', [
    "$q", 
    "Files", 
function($q, Files){

    return {
        execute:execute,
    }

    function run(cmd, args){
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

    function execute(cmd, args){
        return $q(function(resolve, reject){
            resolve(run(cmd, args))
            return true;
        })
    }

    
}]);

angular.module('ngterminal')
.factory('commandman', [
    "$q", 
    "Files", 
function($q, Files){

    return {
        execute:execute,
    }

    function run(cmd, args){
        var contents = Files.read("man");
        return {
            "successful":true,
            "messages":contents
        }
    }

    function execute(cmd, args){
        return $q(function(resolve, reject){
            resolve(run(cmd, args))
            return true;
        })
    }

    
}]);
