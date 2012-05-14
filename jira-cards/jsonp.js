// jsonp utility, without jquery dependence
var jsonp = (function () {
	var root = this;

    var addQueryStringParameter = function (url, name, value) {
        return url + (~url.indexOf('?') ? '&' : '?') + name + '=' + value;
    };

    // Gets a script at URL `src` and loads it into the DOM node `container`. Fires a function `callback`, if provided, when the script loads.
    var getScript = function (src, container, callback) {
        var doc = container.ownerDocument;
        var scriptTag = doc.createElement('script');
        scriptTag.setAttribute('src', src);
        // Allow an event handler to be set on the script load
        if (callback) {
            scriptTag.onload = scriptTag.onreadystatechange = function () {
                if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
                    setTimeout(callback, 1);
                }
            };
        }
        return container.appendChild(scriptTag);
    };	

    // Gets a remote jsonp resource at `url`, invoking `callback` with the response.
    var get = function (url, callback, options) {
        var cb = options.callbackName || ('jsonpcallback' + new Date().getTime());

        root[cb] = function (data) {
            callback(data);
        };

        var ajaxTimeout;
        if (options.error) ajaxTimeout = setTimeout(options.error, options.timeout || 5000);
        var urlWithCallback = addQueryStringParameter(url, options.callbackKey || 'callback', cb);
        return getScript(urlWithCallback, document.head || document.body, function () {
            clearTimeout(ajaxTimeout);
            delete root[cb];
        });
    };

	return {
		get: get,
		getScript: getScript
	};
}());
