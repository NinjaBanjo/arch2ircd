import * as helper from '../lib/helper';
import {expect} from 'chai';

describe('Helpers', () => {

  describe('#flatten', () => {
    it('should flatten multi-dimentional arrays', () => {
      expect(helper.flatten(['a', ['b'], ['c']])).to.deep.equal(['a','b','c']);
    });

    it ('should flatten multi-dimentional arrays recursively', () => {
      expect(helper.flatten(['H', ['e', ['l', 'l']], 'o'])).to.deep.equal(['H','e','l','l','o']);
    });
  });

});