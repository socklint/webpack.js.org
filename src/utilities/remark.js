var markdown = require('remark');
var slug = require('remark-slug');
var visit = require('unist-util-visit');

function getAnchors(content) {
  let anchors = [];

  markdown()
    .use(slug)
    .use(headings)
    .process(content, (err, file) => {
      if (err) {
        throw err;
      }
    });

  function headings() {
    return function transformer(ast) {
      visit(ast, 'heading', visitor);
    };

    function visitor(node) {
      anchors.push({
        title: node.children[0].value,
        id: node.data.id
      });
    }
  }

  return anchors;
}

module.exports = {
  getAnchors
}
