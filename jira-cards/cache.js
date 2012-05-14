
// Simple wrapper around caching things into local storage
var cache = { 
	get: function (key) {
		return localStorage[key] && JSON.parse(localStorage[key]);
	}, 
	put: function (key, value) {
		return localStorage[key] = JSON.stringify(value);
	}, 
	remove: function (key) {
		return delete localStorage[key];
	}
};
