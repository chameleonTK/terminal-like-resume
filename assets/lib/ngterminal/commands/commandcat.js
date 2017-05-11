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
