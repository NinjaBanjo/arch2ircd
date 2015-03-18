export default class Storage{
  constructor(Adapter) {
    this.adapter = Adapter;
  }
  get (key) {return this.adapter.get(key);}
  set (key, value) {return this.adapter.set(key, value)}
  entries () {return this.adapter.entries()}
  keys () {return this.adapter.keys()}
  delete (key) {return this.adapter.delete(key)}
  has (key) {return this.adapter.has(key)}
}