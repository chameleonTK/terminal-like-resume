angular.module('ngterminal')
.directive("terminal",[
    "$sce", 
    "$q",
    "$interval",
function($sce, $q, $interval){

    return {
        scope:{},
        templateUrl: "templates/terminal.html",
        link:function(scope){
            var options = {
                "write_delay":100,
                "init_text":[],
                "terminal_name":"imtk@curveinth"
            }

            var currentIndex = 0;
            var writePromise = $q.resolve();

            scope.plainText = [""]
            scope.lines = [""];

            init();
            function init(){
                var d = new Date();
                var init_text = options.init_text.slice(0);
                init_text.push("Last login : "+d.toUTCString()+" on ttys001");

                var writePromise = init_text.reduce(function(acc, text){
                    return acc.then(function(){
                        return terminalWrite(text);
                    })
                }, $q.resolve());

                writePromise.then(function(){
                    return terminalWrite(options.terminal_name+":~$ ", true);
                })
                
            }

            function newLine(){
                scope.plainText.push("")
                scope.lines.push("")
                currentIndex++;
            }

            function terminalWrite(text, nonewline){
                return $q(function(resolve, reject){
                    var index = 0;
                    $interval(function(){
                        scope.plainText[currentIndex] += escapeHTML(text[index])
                        scope.lines[currentIndex] = $sce.trustAsHtml(scope.plainText[currentIndex]);

                        index++;

                        if (index>=text.length) {
                            if (!nonewline) {
                                newLine();
                            }

                            resolve();
                        }

                    }, options.write_delay, text.length)
                })
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
                    default:
                        return char;
                }
            }
        }
    }
}]);
