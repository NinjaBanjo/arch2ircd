import Parser from '../lib/parser';
import {expect} from 'chai';

var stubs = [
  ":rajaniemi.freenode.net 354 someone 152 #algorithms cinch ec2-54-200-172-246.us-west-2.compute.amazonaws.com kornbluth.freenode.net jinji-isr H 0 :cinch\r\n",
  "\r\n",
  ":I_Am_a_User!~realname@10.21.123.5 JOIN #algorithms user :user\r\n",
  ":Hello!~realname@10.21.123.5 PRIVMSG #algorithms\0 :user\r\n",
  ":cowgirl12!~realname@10.21.123.5 PRIVMSG #test\r :user\r\n",
  ":trollolol!~realname@10.21.123.5 PRIVMSG #test\n :user\r\n",
  ":rajaniemi.freenode.net 354 someone 152 #algorithms cinch ec2-54-200-172-246.us-west-2.compute.amazonaws.com kornbluth.freenode.net jinji-isr H 0 :cinch"
];

var expectedErrors = [
  // CRLF
  'Expected " ", ":", "\\r", [!-9], [;-\\xFF], [\\x01-\\t], [\\x0B-\\f] or [\\x0E-\\x1F] but end of input found.',
  // \x00
  'Expected " ", ":", "\\r", [!-9], [;-\\xFF], [\\x01-\\t], [\\x0B-\\f] or [\\x0E-\\x1F] but "\\x00" found.',  
  // \x0D
  'Expected "\\n" but " " found.',
  // \x0A
  'Expected " ", ":", "\\r", [!-9], [;-\\xFF], [\\x01-\\t], [\\x0B-\\f] or [\\x0E-\\x1F] but "\\n" found.'
];

describe('Parser', () => {

  it('should parse crlf-delimited messages', () => {
    expect(() => Parser.parse(stubs[0])).to.not.Throw(SyntaxError);
  });

  it('should not parse non-crlf-delimited messages', () => {
    expect(() => Parser.parse(stubs[6])).to.Throw(expectedErrors[0]);    
  })

  it('should parse empty crlf-delimited messages', () => {
    expect(() => Parser.parse(stubs[1])).to.not.Throw(SyntaxError);
  });

  it('should not parse NUL octects', () => {
    expect(() => Parser.parse(stubs[3])).to.Throw(expectedErrors[1]);
  });

  describe('Prefix', () => {
    it('should parse server name from prefix', () => {
      expect(Parser.parse(stubs[0])['prefix']['servername']).to.equal('rajaniemi.freenode.net');
    });

    it('should parse nickname from prefix', () => {
      expect(Parser.parse(stubs[2])['prefix']['nickname']).to.equal('I_Am_a_User');
    });

    it('should parse user from prefix', () => {
      expect(Parser.parse(stubs[2])['prefix']['user']).to.equal('~realname');
    });

    it('should parse host from prefix', () => {
      expect(Parser.parse(stubs[2])['prefix']['host']).to.equal('10.21.123.5');
    });

  });

  describe('Command', () => {

    it('should parse command from message', () => {
      expect(Parser.parse(stubs[2])['command']).to.equal('JOIN');
    });

  });

  describe('Parameters', () => {

    it('should parse params from message', () => {
      expect(Parser.parse(stubs[2])['params']).to.deep.equal([['#algorithms', 'user'], 'user']);
    });

    it('should not parse the octets NUL, CR, LF', () => {
      expect(() => Parser.parse(stubs[3])['params']).to.Throw(expectedErrors[1]);
      expect(() => Parser.parse(stubs[4])['params']).to.Throw(expectedErrors[2]);
      expect(() => Parser.parse(stubs[5])['params']).to.Throw(expectedErrors[3]);
    });

  });

});