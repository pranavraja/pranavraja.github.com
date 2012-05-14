var jira = (function () {
	// Similar to `Array.prototype.map`, for keys in an object.
	var map = function (obj, iterator, context) {
		var results = [];
		for (key in obj) {
			if (!obj.hasOwnProperty(key)) continue;
			results.push(iterator.call(context, obj[key], key, obj));
		}
		return results;
	};

	// serializes object `params` in to a key-value string, with values url-encoded.
	var serialize = function (params) {
		return map(params, function (val, key) {
			return key + '=' + encodeURIComponent(val);
		}).join('&');
	};

	// Creates an api object with `baseUrl` (e.g. http://ninemsn.jira.com/rest/api/latest/)
	var JiraAPI = function (baseUrl) {
		this.baseUrl = baseUrl;
	};

	// Sends a request to the API via jsonp and calls `callback` with the response
	JiraAPI.prototype.apiRequest = function (path, params, callback) {
		return jsonp.get(this.baseUrl + path + '?' + serialize(params), callback, { callbackKey: 'jsonp-callback' });
	};

	// Sends a `search` request to the API with JQL query `params.jql`.
	// Possible extra `params` are `startAt`, `maxResults`, `os_username`, and `os_password`
	JiraAPI.prototype.search = function (params, callback) {
		return this.apiRequest('search', params, callback);
	};
	
	return {
		api: function (baseUrl) {
				return new JiraAPI(baseUrl);
			 }
	};
}());

