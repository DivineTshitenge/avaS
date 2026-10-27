if (!Promise.withResolvers) {
  Promise.withResolvers = function withResolvers() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

if (!Map.prototype.getOrInsert) {
  Map.prototype.getOrInsert = function getOrInsert(key, value) {
    if (!this.has(key)) this.set(key, value);
    return this.get(key);
  };
}

if (!Map.prototype.getOrInsertComputed) {
  Map.prototype.getOrInsertComputed = function getOrInsertComputed(key, callback) {
    if (this.has(key)) return this.get(key);
    const value = callback(key);
    this.set(key, value);
    return value;
  };
}
