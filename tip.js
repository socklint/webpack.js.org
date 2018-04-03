// var unified = require('unified');
// var parse = require('remark-parse');
// var html = require('remark-html');
var visit = require('unist-util-visit');

// const md = `T> This is a tip.

// The [configuration](/configuration) properties should be ordered alphabetically as well:

// W> This is a warning.

// ?> This is a todo.`;

// const header = `## Header`;

// const md = "T> The `output` property has [many more configurable features](/configuration/output) and if you like to know more about the concepts behind the `output` property, you can [read more in the concepts section](/concepts/output)."

const classMap = {
  'T>': 'tip',
  'W>': 'warning',
  '?>': 'todo'
};

// unified()
//   .use(parse)
//   .use(tip)
//   .use(html)
//   .process(md, function(err, file) {
//     console.log({ err })
//     console.log(file);
//   });

module.exports = tip;

function tip(options) {
  return transformer;
}

function transformer(tree, file) {
  visit(tree, 'paragraph', visitor);

  function visitor(node) {
    const { children } = node;
    const textNode = children[0].value;

    if (!textNode) return;

    if (
      textNode.startsWith('T>') ||
      textNode.startsWith('W>') ||
      textNode.startsWith('?>')
    ) {
      let className = classMap[textNode.substr(0, 2)];

      node.type = 'blockquote';
      node.data = {
        hName: 'blockquote',
        hProperties: {
          className
        }
      };
      node.children = [
        {
          type: 'paragraph',
          children: [
            {
              ...children[0],
              value: children[0].value.slice(3)
            },
            ...children.slice(1)
          ]
        }
      ];
    }
  }
}
