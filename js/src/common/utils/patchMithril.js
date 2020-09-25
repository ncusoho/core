import Stream from 'mithril/stream';
import Link from '../components/Link';
import withAttr from './withAttr';

export default function patchMithril(global) {
  const defaultMithril = global.m;

  const modifiedMithril = function (comp, ...args) {
    const node = defaultMithril.apply(this, arguments);

    if (!node.attrs) node.attrs = {};

    // Allows the use of the bidi attr.
    if (node.attrs.bidi) {
      modifiedMithril.bidi(node, node.attrs.bidi);
    }

    // Allows us to use a "route" attr on links, which will automatically convert the link to one which
    // supports linking to other pages in the SPA without refreshing the document.
    if (node.attrs.route) {
      node.attrs.href = node.attrs.route;
      node.tag = Link;

      delete node.attrs.route;
    }

    return node;
  };

  Object.keys(defaultMithril).forEach((key) => (modifiedMithril[key] = defaultMithril[key]));

  modifiedMithril.stream = Stream;

  // BEGIN DEPRECATED MITHRIL 2 BC LAYER
  modifiedMithril.prop = Stream;

  modifiedMithril.withAttr = withAttr;
  // END DEPRECATED MITHRIL 2 BC LAYER

  global.m = modifiedMithril;
}
