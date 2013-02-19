module.exports = camera

var Mount = require('./mount')

function camera(game, camera) {
  return new Camera(game, camera)
}

function Camera(game, camera) {
  var T = game.THREE

  this.game = game
  this.camera = camera
  this.mounted = null

  this.inner = new T.Object3D
  this.inner.position.x +=
  this.inner.position.y +=
  this.inner.position.z += 4

  this.obj3d = new T.Object3D

  this.physics = game.makePhysical(this.obj3d, new T.Vector3(
    8, 8, 8     
  ))

  this.inner.add(this.camera)
  this.obj3d.add(this.inner)
  this.game.scene.add(this.obj3d)
  this.game.addItem(this)  
  this.game.addItem(this.physics)  
}

var cons = Camera
  , proto = cons.prototype
  , FORWARD

proto.tick = function(dt) {
  if(!this.mounted) {
    if(this.game.controls.target() === this.physics) {
      this.flycam(dt)
    }
    return
  }

  this.physics.velocity.multiplyScalar(0)

  var T = this.game.THREE
  FORWARD = FORWARD || new T.Vector3(0, 0, -1)
  FORWARD.x = FORWARD.y = 0
  FORWARD.z = 1

  var t = this.mounted.target 

  while(t) {
    t.updateMatrix()
    t.updateMatrixWorld()
    t = t.parent
  }
  this.obj3d.updateMatrix()
  this.obj3d.updateMatrixWorld()

  var cam_pos = this.obj3d.position.clone().multiplyScalar(0)
    , mnt_pos = this.mounted.position()

  this.obj3d.localToWorld(cam_pos)
  cam_pos.subSelf(mnt_pos)

  var t = this.mounted.target 
  this.obj3d.rotation.multiplyScalar(0)


  var y = this.obj3d.rotation.y
    , x = this.obj3d.rotation.x
    , z = this.obj3d.rotation.z

  while(t) {
    x += t.rotation.x
    y += t.rotation.y
    z += t.rotation.z
    t = t.parent
  }

  this.inner.rotation.x = x
  this.obj3d.rotation.y = y

  this.obj3d.updateMatrix()
  this.obj3d.updateMatrixWorld()

  this.obj3d.worldToLocal(this.physics.velocity.copy(mnt_pos))

  this.physics.velocity
      .multiplyScalar(1.0 / dt)
      .multiplyScalar(1.0 - this.mounted.springiness)


  if(this.physics.atRestX()) {
    this.physics.velocity.x = 0
  }

  if(this.physics.atRestY()) {
    this.physics.velocity.y = 0
  }

  if(this.physics.atRestY()) {
    this.physics.velocity.y = 0
  }
}

proto.flycam = function(dt) {
  // if we're in flying camera mode we need to
  // apply the pitch vector ourselves because reasons
}

proto.mount = function(target, vector, springiness) {
  if(!arguments.length) {
    return this.mounted
  }

  this.obj3d.rotation.x =
  this.obj3d.rotation.y = 
  this.obj3d.rotation.z = 0

  // release the mount!
  if(arguments.length === 1 && target === null) {
    this.mounted.target.rotationAutoUpdate = false
    return this.mounted = null
  }

  vector = vector || new this.game.THREE.Vector3(0, 0, 0)
  springiness = springiness || 0
  target.rotationAutoUpdate = true

  var had_mount = !!this.mounted
  this.mounted = new Mount(target, vector, springiness)

  if(!had_mount) {
  var t = target
  this.obj3d.position.copy(vector)
  while(t) {
    t.updateMatrixWorld()
    t = t.parent
  }
  target.localToWorld(this.obj3d.position)
  }

  return this.mounted
}
