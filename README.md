# voxel-physical-camera

a physical camera for voxel-engine. intended to be baked directly into the engine.

## API

#### game.view.mount() -> current mount

returns the current mount object

#### game.view.mount(null) -> null

release the current mount.

#### game.view.mount(THREE.Object3D target, THREE.Vector3 vector, float springiness)

mount to a new object.

## LICENSE

MIT
