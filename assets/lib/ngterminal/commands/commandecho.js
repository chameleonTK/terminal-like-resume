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
