angular.module('ngterminal', [])
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
                var helloMessage = "Last login : "+d.toUTCString()+" on ttys001";

                var writePromise = options.init_text.reduce(function(acc, text){
                    return acc.then(function(){
                        return terminalWrite(text);
                    })
                }, terminalWrite(helloMessage));

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
                        scope.plainText[currentIndex] += text[index]
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
        }
    }
}]);
