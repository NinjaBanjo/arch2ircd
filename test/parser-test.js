import Parser from '../lib/parser';
import * as chai from 'chai';

var stubs = [
  ':rajaniemi.freenode.net 354 someone 152 #algorithms ~cinch ec2-54-200-172-246.us-west-2.compute.amazonaws.com kornbluth.freenode.net jinji-isr H 0 :cinch',
  "\r\n",
  ':someone!~realname@2601:a:6781:2cf3:1c12:a2f3:7c94:b714 JOIN #algorithms user :user',
  ":someone!~realname@2601:a:6781:2cf3:1c12:a2f3:7c94:b714 PRIVMSG #algorithms\0 user :user",
  ":someone!~realname@2601:a:6781:2cf3:1c12:a2f3:7c94:b714 PRIVMSG #test\r#test2 user :user",
  ":someone!~realname@2601:a:6781:2cf3:1c12:a2f3:7c94:b714 PRIVMSG #test\n#test2 user :user"
];

describe('Parser', () => {

  before(() => {
    global.expect = chai.expect;
  });

  it('should parse crlf-delimited messages', () => {
    expect((new Parser()).parse(stubs[0])).to.not.throw(Exception);
  });

  it('should parse empty crlf-delimited messages', () => {
    expect((new Parser()).parse(stubs[1])).to.not.throw(Exception);
  });

  it('should not parse NUL octects', () => {
    expect((new Parser()).parse(stubs[3])).to.throw(Exception);
  });

  describe('Prefix', () => {
 
    it('should parse server name from prefix', () => {
      expect((new Parser()).parse(stubs[0], 'prefix')[0]).to.equal('rajaniemi.freenode.net');
    });

    it('should parse nickname from prefix', () => {
      expect((new Parser()).parse(stubs[1], 'prefix')[0]).to.equal('someone');
    });

    it('should parse user from prefix', () => {
      expect((new Parser()).parse(stubs[1], 'prefix')[1]).to.equal('~realname');
    });

    it('should parse host from prefix', () => {
      expect((new Parser()).parse(stubs[1], 'prefix')[2]).to.equal('2601:a:6781:2cf3:1c12:a2f3:7c94:b714');
    });

  });

  describe('Command', () => {

    it('should parse command from message', () => {
      expect((new Parser()).parse(stubs[2])[1]).to.equal('JOIN');
    });

  });

  describe('Parameters', () => {

    it('should parse params from message', () => {
      expect((new Parser()).parse(stubs[1])[2]).to.equal('#algorithms user :user');
    });

    it('should not parse the octets NUL, CR, LF', () => {
      expect((new Parser()).parse(stubs[3], 'params')).to.throw(Exception);
      expect((new Parser()).parse(stubs[4], 'params')).to.throw(Exception);
      expect((new Parser()).parse(stubs[5], 'params')).to.throw(Exception);
    });

  });

});