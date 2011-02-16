written through short turmoil by `me <mailto:dasacc22@gmail.com>`_.

What's the Point
================
If you stumbled across this page, you may be wondering what this is all about. Specifically, this is to ease the pain of implementing prototypal inheritance in javascript. Whats so painful about the current implementation? Let's go over some example code.

First, lets write up a base object that we’ll want to inherit from.

::
  
  function A(name, age) {
    this.name = name;
    this.age = age;
    this.get_name = function() { return this.name; }
    this.get_age = function() { return this.age; }
  }

Now, according to `MDC <https://developer.mozilla.org/en/JavaScript>`_ we are being naive to write code like this for the purpose of inheritance. The only way to call the get_name and get_age functions is with an instance of A. Prototypal or not, that doesn’t help inheritance much, so lets do this right.

::

  function A(name, age) {
    this.age = age;
    this.name = name;
  }
  A.prototype = {
    get_age: function() { return this.age; },
    get_name: function() { return this.name; }
  }

Now make B and inherit A

::

  function B() {};
  B.prototype = new A;

Now lets make C with an extra param and function and inherit A.

::

  function C(name, age, title, money) {
    this.title = title;
    this.money = money;
  };
  C.prototype = new A;
  C.prototype = {
    get_title: function() { return this.title; },
    get_money: function() { return this.money; }
  }

Good? Not hardly. We cannot continue the flow we've been taking, it just doesn’t work. I erased the A prototype by using the prototype = {} syntax. So that syntax is no good for working with inheritance unless its the top level object, but I don't want to think about that when programming. Lets fix C for now.

::
  
  function C(name, age, title, money) {
    this.title = title;
    this.money = money;
  };
  C.prototype = new A;
  C.prototype.get_title = function() { return this.title; }
  C.prototype.get_money = function() { return this.money; }

Now if you fire this up and test C you'll notice both attributes name and age are missing. This is because the constructor of A, the same thing that was C.prototype=’d, needs to be called manually.

Thats ok and pretty normal, so lets fix it by adding that A.call

::
  
  function C(name, age, title, money) {
    A.call(this, name, age);
    this.title = title;
    this.money = money;
  };
  C.prototype = new A;
  C.prototype.get_title = function() { return this.title; }
  C.prototype.get_money = function() { return this.money; }

Sweet buttery buttons! It works! You might note this code runs slower then one big object mash-up. Its the .call() method. This is a lot of leg work to use prototypal inheritance and places limits on a language that is otherwise rather expressive (though obscure at times). Now lets see what our js.js library can do to help with this.

How to use This
===============
Let's go ahead and rewrite the above example following some basic paradigms.

::
  
  var A {
      get_name: function() { return this.name; },
      get_age: function() { return this.age; }
  };
  
  var B = prototype(A, object);
  
  function _C() {
      this.get_title = function() { return this.title; }
      this.get_money = function() { return this.money; }
  }
  var C = prototype(_C, A, object);
  
  var c = new C({name: 'Daniel', age: 25, title: 'Programmer', money: 0.99})
  c.get_name() // returns Daniel
  c.get_age() // returns 25
  c.get_title() // returns Programmer
  c.get_money() // returns 0.99

You'll notice A is written as an object. This is in the case that we want to redeclare A's functionality, then we can call the original method without the need to access the .prototype attribute. On its own, A is quite usable as we can declare a new instance of it and set the appropriate attributes outside of its scope. For example:

::
  
  var a = new A();
  a.name = 'Daniel';
  a.age = 25;
  // and then a.get_name() and a.get_age() return appropriately

B inherits from A and also object, a special javascript object with an init magic method. This allows us to use the functionality of A and declare its variables in one line.

::
  
  var b = new B({name: 'Daniel', age: 25});

Next we have _C. The purpose of this naming convention is utterly personal. Effectively, _C is something that I've decided I will never need or want to access directly. Instead I would use the prototype'd C if ever needed. Note that this could be avoided by simply declaring the contents of _C inline during prototype declaration like so:

::
  
  var C = prototype(function() {
      this.init = function() { console.log('msg from the init') }
      this.get_title = function() { return this.title; }
      this.get_money = function() { return this.money; }
      this.get_name = function() {
          console.log('Simple parent calls');
          A.get_name.call(this);
      }
  }, A, object);

Note how I changed the get_name method of C above as well. If the function being called requires access to C properties, a use of .call and a reference to this is required. Also note the this.init function. All returns from prototype feature an __init__ magic method that instantiates keyword arguments as new object properties and then calls an objects init method if available. You can override js.js object's __init__ or suit js.js object's code to your liking, its short and sweet. Cases for such include overriding __init__ to handle variables passed in or setting up an init() to do things like bind object events to the UI on page load (assuming you instantiate the instance of the object on document load).

You can specify your own constructor with magic methods instead of object. Refer to object closure in source as example.

Get the Code
============
This code is placed in the public domain and has no restrictions; there is no copyright.
 
| `Download the source <http://github.com/dasacc22/js.js/raw/master/js.js>`_ (814 bytes)
| `Download minified version <http://github.com/dasacc22/js.js/raw/master/js.min.js>`_ (560 bytes)
