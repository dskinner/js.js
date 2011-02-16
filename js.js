var object = function() {
    F = function() {
        this.__init__(arguments[0]);
    };
    F.prototype.__init__ = function(kwargs) {
        for (var k in kwargs) {
            this[k] = kwargs[k];
        }
        if (typeof this.init == "function") {
            this.init();
        }
    };
    return F;
}

function prototype() {
    var l = arguments.length;
    var that = arguments[l-1]();

    for (var x=l-2; x>=0; --x) {
        if (typeof arguments[x] == "object") {
            var m = arguments[x];
        } else if (typeof arguments[x] == "function") {
            var m = new arguments[x];
        } else {
            throw new Error("prototype() only accepts objects and functions as parameters");
        }
        for (var i in m) { that.prototype[i] = m[i]; }
    }

    return that;
};
