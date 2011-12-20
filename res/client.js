var head, body;

function addStylesheet(href) {
	head.append('<link href="'+href+'" rel="stylesheet" type="text/css">');
}

function addContent(href) {
	body.append(content);
}

function parseDocument(text) {
	var content = text.split('--- CONTENT ---');
	
	if (content.length != 2)
		console.log('Invalid content');
	
	return {
		properties: parseProperties(content[0]),
		html: marked(content[1])
	};
}

function parseProperties(text) {
	var lines = text.split(/\r\n|\r|\n/);
	var properties = {};
	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];
		var match;
		if (match = /@(\w+):\s*([^ ]+)/i.exec(line)) {
			properties[match[1]] = match[2];
		}
	}
	return properties;
}

$.domReady(function () {
	head = $('head');
	body = $('body');
	
	$('link[rel=alternate]').each(function(link, i) {
		request('GET', link.href, function onComplete(status, result) {
			if (status === 200) {
				var doc = parseDocument(result);
				body.append(doc.html);
				if (doc.properties.stylesheet)
					addStylesheet(doc.properties.stylesheet);
				
				console.log(doc);
			}
		});
	});
});
