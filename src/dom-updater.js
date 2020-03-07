/*
 license: The MIT License, Copyright (c) 2020 YUKI "Piro" Hiroshi
*/

import { SequenceMatcher } from './diff.js';

export const DOMUpdater = {
  /**
   * method
   * @param before {Node}   - the node to be updated, e.g. Element
   * @param after  {Node}   - the node describing updated state,
   *                          e.g. DocumentFragment
   * @return count {number} - the count of appied changes
   */
  update(before, after, counter = { count: 0 }) {
    if (before.nodeValue !== null ||
        after.nodeValue !== null) {
      if (before.nodeValue != after.nodeValue) {
        //console.log('node value: ', after.nodeValue);
        before.nodeValue = after.nodeValue;
        counter.count++;
      }
      return counter.count;
    }

    const beforeNodes = Array.from(before.childNodes, this._getDiffableNodeString);
    const afterNodes = Array.from(after.childNodes, this._getDiffableNodeString);
    const nodeOerations = (new SequenceMatcher(beforeNodes, afterNodes)).operations();
    // Update from back to front for safety!
    for (const operation of nodeOerations.reverse()) {
      const [tag, fromStart, fromEnd, toStart, toEnd] = operation;
      switch (tag) {
        case 'equal':
          for (let i = 0, maxi = fromEnd - fromStart; i < maxi; i++) {
            this.update(
              before.childNodes[fromStart + i],
              after.childNodes[toStart + i],
              counter
            );
          }
          break;
        case 'delete':
          for (let i = fromEnd - 1; i >= fromStart; i--) {
            //console.log('delete: delete node: ', i, before.childNodes[i]);
            before.removeChild(before.childNodes[i]);
            counter.count++;
          }
          break;
        case 'insert': {
          const reference = before.childNodes[fromStart] || null;
          for (let i = toStart; i < toEnd; i++) {
            if (!after.childNodes[i])
              continue;
            //console.console.log('insert: insert node: ', i, after.childNodes[i]);
            before.insertBefore(after.childNodes[i].cloneNode(true), reference);
            counter.count++;
          }
        }; break;
        case 'replace': {
          for (let i = fromEnd - 1; i >= fromStart; i--) {
            //console.log('replace: delete node: ', i, before.childNodes[i]);
            before.removeChild(before.childNodes[i]);
            counter.count++;
          }
          const reference = before.childNodes[fromStart] || null;
          for (let i = toStart; i < toEnd; i++) {
            if (!after.childNodes[i])
              continue;
            //console.log('replace: insert node: ', i, after.childNodes[i]);
            before.insertBefore(after.childNodes[i].cloneNode(true), reference);
            counter.count++;
          }
        }; break;
      }
    }

    if (before.nodeType == before.ELEMENT_NODE &&
        after.nodeType == after.ELEMENT_NODE) {
      const beforeAttrs = Array.from(before.attributes, attr => `${attr.name}:${attr.value}`).  sort();
      const afterAttrs = Array.from(after.attributes, attr => `${attr.name}:${attr.value}`).  sort();
      const attrOerations = (new SequenceMatcher(beforeAttrs, afterAttrs)).operations();
      for (const operation of attrOerations) {
        const [tag, fromStart, fromEnd, toStart, toEnd] = operation;
        switch (tag) {
          case 'equal':
            break;
          case 'delete':
            for (let i = fromStart; i < fromEnd; i++) {
              const name = beforeAttrs[i].split(':')[0];
              //console.log('delete: delete attr: ', name);
              before.removeAttribute(name);
              counter.count++;
            }
            break;
          case 'insert':
            for (let i = toStart; i < toEnd; i++) {
              const attr = afterAttrs[i].split(':');
              const name = attr[0];
              const value = attr.slice(1).join(':');
              //console.log('insert: set attr: ', name, value);
              before.setAttribute(name, value);
              counter.count++;
            }
            break;
          case 'replace':
            const insertedAttrs = new Set();
            for (let i = toStart; i < toEnd; i++) {
              const attr = afterAttrs[i].split(':');
              const name = attr[0];
              const value = attr.slice(1).join(':');
              //console.log('replace: set attr: ', name, value);
              before.setAttribute(name, value);
              insertedAttrs.add(name);
              counter.count++;
            }
            for (let i = fromStart; i < fromEnd; i++) {
              const name = beforeAttrs[i].split(':')[0];
              if (insertedAttrs.has(name))
                continue;
              //console.log('replace: delete attr: ', name);
              before.removeAttribute(name);
              counter.count++;
            }
            break;
        }
      }
    }
    return counter.count;
  },

  _getDiffableNodeString(node) {
    if (node.nodeType == node.ELEMENT_NODE)
      return `element:${node.tagName}#${node.id}#${node.getAttribute('anonid')}`;
    else
      return `node:${node.nodeType}`;
  }

};
