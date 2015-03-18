import MapAdapter from '../lib/adapters/map-adapter';
import Storage from '../lib/storage';
import {expect} from 'chai';

describe("Storage", () => {
  var storage;

  beforeEach(() => {
    storage = new Storage(new MapAdapter);
  });

  describe("#set", () => {
    it("should set the value with the given key", () => {
      var has = false;
      storage.set("test", "example");
      for (let e of storage.adapter) {
        if (e[0] == "test" && e[1] == "example") {
          has = true;
        }
      }
      expect(has).to.be.true;
    });
  });

  describe("#get", () => {
    beforeEach(() => {
      storage.set("test", "example");
    });
    it("should get the value with the given key", () => {
      expect(storage.get('test')).to.equal("example");
    });
  });

  describe('#entries', () => {
    beforeEach(() => {
      storage.set("test", "example");
      storage.set("another", "one");
    });
    it("should return an iterator that contains an array for each element in the Storage object in insertion order", () => {
      var entries = storage.entries();
      var firstEntry = entries.next();
      var secondEntry = entries.next();
      expect(firstEntry.value[0]).to.equal('test');
      expect(firstEntry.value[1]).to.equal('example');
      expect(secondEntry.value[0]).to.equal('another');
      expect(secondEntry.value[1]).to.equal('one');
    });
  });

  describe('#keys', () => {
    beforeEach(() => {
      storage.set("test", "example");
      storage.set("another", "one");
    });
    it("should return an iterator that contains they key for each element in the Storage object in insertion order", () => {
      var keys = storage.keys();
      var firstKey = keys.next();
      var secondKey = keys.next();
      expect(firstKey.value).to.equal("test");
      expect(secondKey.value).to.equal("another");
    });
  });

  describe('#delete', () => {
    beforeEach(()=> {
      storage.set("test", "example");
    });
    it("should delete an item with the given key from the Storage object", () => {
      var initialSize = 0;
      var finalSize = 0;
      for (let e of storage.adapter) {
        initialSize++;
      }
      storage.delete("test");
      for (let e of storage.adapter) {
        finalSize++;
      }
      expect(finalSize).to.equal(initialSize - 1);
    });
  });

  describe('#has', () => {
    beforeEach(() => {
      storage.set("test", "example");
    });
    it("should return true if the given key exists", () => {
      expect(storage.has("test")).to.be.true;
    });
    it("should return false if the given key does not exist", () => {
      expect(storage.has("nothing")).to.be.false;
    });
  });
});