/*
MODULE PATTERN EXAMPLE
*/
//create namespace: check for variable/namespace existence. If already defined, use that instance, otherwise assign a new object literal to SukoNamespace
var SukoNamespace = SukoNamespace || {};

//add modules to the namespace (using a function to encapsulate the module - thus emulating a private method):
SukoNamespace.module1 = function(){

    var myPrivateProperty1 = 'private and in module';
    var myPublicProperty = 'joe public';

    
    var _myPrivateFunction = function(){  //a convention to use _prefix for private methods
      var myPrivateProperty2 = 'private and in private function';
      console.log("message from inside myPrivateFunction! " + myPrivateProperty2);

    };  

    var myPublicFunction = function(){
      console.log("myPublicFunction - this will now call a private function");
      _myPrivateFunction();
      console.log(myPrivateProperty1 + ' ...called from a public function');
    };

    //a setup function
    var init = function(){
      // Do some setup stuff
      console.log("init!");

    };

    console.log(myPrivateProperty1);
    _myPrivateFunction();

    //any methods and properties that need to be public are inserted into this variable, to be returned
    //'revealing module pattern'
    var oPublic = {
				      init: init,
				      myPublicProperty: myPublicProperty,
				      myPublicFunction: myPublicFunction
				   };
	//returns an object with only what needs to be public. Everything else remains private
    return oPublic; 

}();

//see what's public
console.log(SukoNamespace.module1);

// call setup function....
console.log("Calling init()...");
SukoNamespace.module1.init();

// call public function.  This will call myPrivateFunction and it'll work because it's called from within a public function inside the module.
console.log("Calling myPublicFunction()...");
SukoNamespace.module1.myPublicFunction();

console.log(SukoNamespace.module1.myPrivateProperty1); //undefined, because private
console.log(SukoNamespace.module1.myPublicProperty); 

//SukoNamespace.module1._myPrivateFunction(); //error: not accessible from outside the module.