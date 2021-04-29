"use strict";
var PuzzleGame;
(function (PuzzleGame) {
    var f = FudgeCore;
    class Avatar extends f.Node {
        constructor() {
            super("Avatar");
            this.movementspeed = 10;
            this.turnspeed = 100;
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
            this.body.rotationInfluenceFactor = new f.Vector3(0, 0, 0);
            this.body.friction = 0.01;
            this.addComponent(this.body);
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, event => this.update(event));
        }
        static get instance() {
            if (this._instance == undefined) {
                this._instance = new Avatar();
            }
            return this._instance;
        }
        update(_event) {
            let rotateDir = 0;
            let moveDir = f.Vector2.ZERO();
            if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.W, f.KEYBOARD_CODE.ARROW_UP])) {
                moveDir.y += 1;
            }
            if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.A, f.KEYBOARD_CODE.ARROW_LEFT])) {
                moveDir.x -= 1;
            }
            if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.S, f.KEYBOARD_CODE.ARROW_DOWN])) {
                moveDir.y -= 1;
            }
            if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.D, f.KEYBOARD_CODE.ARROW_RIGHT])) {
                moveDir.x += 1;
            }
            if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.Q, f.KEYBOARD_CODE.PAGE_UP])) {
                rotateDir += 1;
            }
            if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.E, f.KEYBOARD_CODE.PAGE_DOWN])) {
                rotateDir += -1;
            }
            if (rotateDir != 0) {
                let rotationChange = new f.Vector3();
                rotationChange.y = rotateDir * this.turnspeed * f.Loop.timeFrameReal / 1000;
                this.body.rotateBody(rotationChange);
            }
            if (moveDir.x != 0 || moveDir.y != 0) {
                moveDir.normalize();
                let forward = f.Vector3.Z();
                forward.transform(this.mtxWorld, false);
                let velocity = new f.Vector3();
                velocity.x = (forward.x * moveDir.x + forward.z * moveDir.y) * this.movementspeed;
                velocity.y = this.body.getVelocity().y;
                velocity.z = (forward.z * moveDir.x - forward.x * moveDir.y) * this.movementspeed;
                this.body.setVelocity(velocity);
            }
            else
                this.body.setVelocity(f.Vector3.Y(this.body.getVelocity().y));
        }
    }
    PuzzleGame.Avatar = Avatar;
})(PuzzleGame || (PuzzleGame = {}));
//# sourceMappingURL=Avatar.js.map