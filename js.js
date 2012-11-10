/**
 * Easy Prototypal Inheritance with Javascript.
 *
 * arguments:
 *  Ordered from type to subtype, ex: prototype(Mammal, Cat);
 */
function prototype() {

	var type = function() {
		F = function() {
			if (typeof this.init == "function") {
				this.init.apply(this, arguments);
			}
		};
		return F;
	}

	var that = type();

	for (var x=0; x<arguments.length; x++) {
		var obj;
		if (typeof arguments[x] == "object") {
			obj = arguments[x];
		} else if (typeof arguments[x] == "function") {
			obj = new arguments[x];
		} else {
			throw new Error("prototype() only accepts objects and functions as parameters");
		}
		for (var i in obj) { that.prototype[i] = obj[i]; }
	}

	return that;
};
