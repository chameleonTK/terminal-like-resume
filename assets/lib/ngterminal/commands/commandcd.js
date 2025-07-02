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
                $window.open("https://chameleontk.github.io", '_blank');
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
