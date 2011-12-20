var head, body;

function addStylesheet(href) {
  head.append('<link rel="stylesheet" href="' + href + '">');
}

function addContent(href) {
  body.append(content);
}

function parseDocument(text) {
  var content = text.split('--- CONTENT ---');

  if (content.length != 2)
    console.log('Invalid content');

  return {
    properties : parseProperties(content[0]),
    html : marked(content[1])
  };
}

function parseProperties(text) {
  var lines = text.split(/\r\n|\r|\n/);
  var properties = {};
  for ( var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var match;
    // match property: @key: value
    if (match = /@(\w+):\s*([^ ]+)/i.exec(line)) {
      // add property: properties[key] = value
      properties[match[1]] = match[2];
    }
  }
  return properties;
}

$.domReady(function() {
  head = $('head');
  body = $('body');

  $('link[rel=alternate]').each(
      function(link, i) {
        request('GET', link.href, function onComplete(status, result) {
          if (status === 200) {
            var doc = parseDocument(result);
            body.append('<div class="' + doc.properties.type + '">' + doc.html
                + '</div>');
            if (doc.properties.stylesheet)
              addStylesheet(doc.properties.stylesheet);

            console.log(doc);
          }
        });
      });
});
