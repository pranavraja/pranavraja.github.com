
function getSelectedOrPreviousWord(editorcontainer) {
	var sel = getCurrentSel(editorcontainer);
	if (!sel) {
		var result = /\s\S*$/.exec(editorcontainer.value.substring(0, editorcontainer.selectionStart));
		if (result && (result.index+1 == editorcontainer.selectionStart)) return null;
		var lastSpace = result ? result.index+1 : 0;
		editorcontainer.selectionStart = lastSpace;
		sel = getCurrentSel(editorcontainer);
	}
	return sel;
}

function getCurrentSel(txt) {
	return txt.value.substring(txt.selectionStart, txt.selectionEnd);
}

function addTemplate(editorcontainer, val) {
	var sel = getSelectedOrPreviousWord(editorcontainer);
	val = val.replace(/^\s+|\s+$/g,'');
	var formatted = val.replace(/\{sel\}/g, sel);

	sellocation = formatted.indexOf("{cursor}");
	if (sellocation == -1) sellocation = formatted.length;
	sellocation += editorcontainer.selectionStart;

	formatted = formatted.replace(/\{cursor\}/, '');

	replaceSelection(editorcontainer, formatted);
	editorcontainer.selectionStart = sellocation;
	editorcontainer.selectionEnd = sellocation;
}

function tokens(str) {
	return str.match(/[\w_]{4,}/g);
}

function replaceSelection(editorcontainer, repl) {
	editorcontainer.value = editorcontainer.value.substring(0, editorcontainer.selectionStart) + repl + editorcontainer.value.substring(editorcontainer.selectionEnd);
}

function completeSelection(txtarea) {
	var sel = getSelectedOrPreviousWord(txtarea);
	if (!sel) return;
	var tokenlist = tokens(txtarea.value);
	tokenlist.sort(function (a,b) { return a.length - b.length; });
	for (var i=0; i < tokenlist.length; i++) {
		if (tokenlist[i].indexOf(sel) == 0) {
			sellocation = txtarea.selectionStart + tokenlist[i].length;
			replaceSelection(txtarea, tokenlist[i]);
			txtarea.selectionStart = sellocation;
			txtarea.selectionEnd = sellocation;
			return;
		}
	}
}

function currentLine(txtarea) {
	var target = txtarea.selectionStart;
	var current = 0;
	var lines = txtarea.value.split('\n');
	for (var i=0; i < lines.length; i++) {
		current += lines[i].length+1;
		if (current >= target) return lines[i];
	}
	return lines[lines.length - 1];
}

function addIndentedLine(txtarea) {
	var lastline = currentLine(txtarea);
	spacesoncurrentline = lastline.match(/^(\s*)/)[1];
	if (txtarea.value.charAt(txtarea.selectionStart-1) == '{') {
		valuetoadd = '\n    ' + spacesoncurrentline;
	}
	else {
		valuetoadd = '\n' + spacesoncurrentline;
	}
	var newsel = txtarea.selectionStart + valuetoadd.length;
	replaceSelection(txtarea, valuetoadd);
	txtarea.selectionStart = newsel;
	txtarea.selectionEnd = newsel;
}

// keycodes
var TAB_KEYCODE = 9;
var ENTER_KEYCODE = 13;

$(function () {
	$('.template-bind').live('change', function () {
		$(this).prevAll('.template-link').attr('accessKey',$(this).val());
	});
	$('.template-link').live('click', function () {
		addTemplate($('#editor-container').get(0), $(this).nextAll('.template-text').val());
	});
	$('#add-new-template').click(function () {
		$('#templates-container').children('.template').first().clone().appendTo('#templates-container');
	});
	$('.template-bind').trigger('change');

	$('#editor-container').bind('keydown', function (event) {
		// autocomplete
		if (event.keyCode == TAB_KEYCODE) {
			completeSelection(this);
			return false;
		}
		// autoindent
		else if (event.keyCode == ENTER_KEYCODE) {
			addIndentedLine(this);
			return false;
		}
	});
});
