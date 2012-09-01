var repl = (function() {
  var compile, firstOf, getLines, renderLines, renderSnippet;
  renderSnippet = function(snippet, actions) {
  	if (!snippet) return snippet;
    var element, _i, _len;
    for (_i = 0, _len = actions.length; _i < _len; _i++) {
      element = actions[_i];
	  snippet = snippet.replace(element[0], element[1]);
    };
	return snippet;
  };
  getLines = function(editor) {
    return editor.value.split('\n');
  };
  renderLines = function(editor, actions) {
    var line, _i, _len, _ref, _results;
    _ref = getLines(editor);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      line = _ref[_i];
      _results.push(renderSnippet(line, actions));
    }
    return _results;
  };
  compile = function(actions, editorFrom, editorTo) {
    return editorTo.value = renderLines(editorFrom, actions).join('\n');
  };
  return {
	  compile: compile	
  };
})();
