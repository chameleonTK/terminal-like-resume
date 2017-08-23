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
