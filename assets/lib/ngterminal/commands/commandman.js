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
