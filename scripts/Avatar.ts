namespace PuzzleGame {
  import f = FudgeCore;

  export class Avatar extends f.Node {
    private static _instance: Avatar;

    readonly camera: f.ComponentCamera;
    readonly body: f.ComponentRigidbody;
    readonly movementspeed: number = 20;
    readonly turnspeed: number = 20;

    private constructor() {
      super("Avatar");
      this.addComponent(new f.ComponentTransform());
      this.mtxLocal.translateY(3);

      this.camera = new f.ComponentCamera();
      this.camera.clrBackground = f.Color.CSS("GREY");
      this.camera.mtxPivot.translateX(-1.5);
      this.camera.mtxPivot.translateY(1.5);
      this.camera.mtxPivot.rotateY(90);
      this.camera.mtxPivot.rotateX(10);
      this.addComponent(this.camera);

      this.body = new f.ComponentRigidbody(70, f.PHYSICS_TYPE.DYNAMIC, f.COLLIDER_TYPE.CAPSULE, f.PHYSICS_GROUP.DEFAULT);
      this.addComponent(this.body);

      f.Loop.addEventListener(f.EVENT.LOOP_FRAME, () => this.update);
    }
    
    public static get instance(): Avatar {
      if (this._instance == undefined) {
        this._instance = new Avatar();
      }
      return this._instance;
    }

    private update(_event: Event): void {
      let rotateDir: number = 0;
      let moveDir: f.Vector2 = f.Vector2.ZERO();
      if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.W, f.KEYBOARD_CODE.ARROW_UP])) {
        moveDir.x += 1;
      }
      if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.A, f.KEYBOARD_CODE.ARROW_LEFT])) {
        moveDir.y += 1;
      }
      if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.S, f.KEYBOARD_CODE.ARROW_DOWN])) {
        moveDir.x += -1;
      }
      if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.D, f.KEYBOARD_CODE.ARROW_RIGHT])) {
        moveDir.y += -1;
      }
      if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.Q, f.KEYBOARD_CODE.PAGE_UP])) {
        rotateDir += 1;
      }
      if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.E, f.KEYBOARD_CODE.PAGE_DOWN])) {
        rotateDir += -1;
      }
      if (rotateDir != 0) {
        let rotationChange: f.Vector3 = new f.Vector3();
        rotationChange.y = rotateDir * this.turnspeed * f.Loop.timeFrameReal / 1000;
        this.body.rotateBody(rotationChange);
      }
      if (moveDir.x != 0 || moveDir.y != 0) {
        moveDir.normalize();

        let forward: f.Vector3 = f.Vector3.Z();
        forward.transform(this.mtxWorld, false);
        
        let velocity: f.Vector3 = new f.Vector3();
        velocity.x = (forward.x * moveDir.x + forward.z * moveDir.y) * this.movementspeed;
        velocity.y = this.body.getVelocity().y;
        velocity.z = (forward.z * moveDir.x - forward.x * moveDir.y) * this.movementspeed;

        this.body.setVelocity(velocity);
      }
      else this.body.setVelocity(f.Vector3.Y(this.body.getVelocity().y));
    }
  }
}