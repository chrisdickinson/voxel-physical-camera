module.exports = Mount

function Mount(target, vector, springiness) {
  this.springiness = springiness
  this.offset = vector
  this.target = target
  this._world = this.offset.clone().multiplyScalar(0)
}

var cons = Mount
  , proto = cons.prototype

proto.position = function() {
  var target = this.target
  this._world.copy(this.offset)

  this.target.localToWorld(this._world)
  return this._world
}
