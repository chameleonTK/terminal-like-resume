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
