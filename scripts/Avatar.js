"use strict";
var PuzzleGame;
(function (PuzzleGame) {
    var f = FudgeCore;
    class Avatar extends f.Node {
        constructor() {
            super("Avatar");
            this.movementspeed = 1000;
            this.turnspeed = 100;
            this.throwCharge = 0;
            this.addComponent(new f.ComponentTransform());
            this.mtxLocal.translateY(3);
            this.mtxLocal.rotateY(90);
            this.camera = new f.ComponentCamera();
            this.camera.clrBackground = f.Color.CSS("GREY");
            this.camera.mtxPivot.translateY(1);
            this.camera.mtxPivot.translateZ(-1.25);
            this.camera.mtxPivot.rotateX(10);
            this.addComponent(this.camera);
            this.body = new f.ComponentRigidbody(70, f.PHYSICS_TYPE.DYNAMIC, f.COLLIDER_TYPE.CAPSULE, f.PHYSICS_GROUP.DEFAULT);
            this.body.rotationInfluenceFactor = new f.Vector3(0, 0, 0);
            this.body.friction = 1;
            this.addComponent(this.body);
            f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, event => this.update(event));
            window.addEventListener("keydown", event => this.handleKeyDown(event));
            window.addEventListener("keyup", event => this.handleKeyUp(event));
        }
        static get instance() {
            if (this._instance == undefined) {
                this._instance = new Avatar();
            }
            return this._instance;
        }
        update(_event) {
            this.movement();
            if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.F]))
                this.throwCharge += 100;
        }
        movement() {
            let rotateDir = 0;
            let moveDir = f.Vector2.ZERO();
            if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.W, f.KEYBOARD_CODE.ARROW_UP])) {
                moveDir.x += 1;
            }
            if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.A, f.KEYBOARD_CODE.ARROW_LEFT])) {
                moveDir.y += 1;
            }
            if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.S, f.KEYBOARD_CODE.ARROW_DOWN])) {
                moveDir.x -= 1;
            }
            if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.D, f.KEYBOARD_CODE.ARROW_RIGHT])) {
                moveDir.y -= 1;
            }
            if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.Q, f.KEYBOARD_CODE.PAGE_UP])) {
                rotateDir += 1;
            }
            if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.E, f.KEYBOARD_CODE.PAGE_DOWN])) {
                rotateDir -= 1;
            }
            if (rotateDir != 0) {
                let rotationChange = new f.Vector3();
                rotationChange.y = rotateDir * this.turnspeed * f.Loop.timeFrameReal / 1000;
                this.body.rotateBody(rotationChange);
            }
            if (moveDir.x != 0 || moveDir.y != 0) {
                moveDir.normalize();
                let forward = this.mtxWorld.getZ();
                let force = new f.Vector3();
                force.x = (forward.x * moveDir.x + forward.z * moveDir.y) * this.movementspeed - Math.pow(this.body.getVelocity().x, 3);
                force.z = (forward.z * moveDir.x - forward.x * moveDir.y) * this.movementspeed - Math.pow(this.body.getVelocity().z, 3);
                this.body.applyForce(force);
            }
            else {
                this.body.setVelocity(f.Vector3.Y(this.body.getVelocity().y));
            }
        }
        handleKeyDown(_event) {
            if (_event.code == f.KEYBOARD_CODE.R) {
                if (this.grabbedCube == undefined)
                    this.grab();
                else
                    this.drop();
            }
        }
        handleKeyUp(_event) {
            if (_event.code == f.KEYBOARD_CODE.F)
                this.throw();
        }
        grab() {
            let cubesInFrontMappedByDistance = new Map(PuzzleGame.cubes.getChildren()
                .map(cube => [f.Vector3.DIFFERENCE(this.mtxWorld.translation, cube.mtxWorld.translation), cube])
                .filter(([difference]) => f.Vector3.DOT(this.mtxWorld.getZ(), f.Vector3.NORMALIZATION(difference)) < -0.8)
                .map(([difference, card]) => [difference.magnitude, card]));
            let minDistance = Math.min(...cubesInFrontMappedByDistance.keys());
            if (minDistance < 3) {
                this.grabbedCube = cubesInFrontMappedByDistance.get(minDistance);
                this.grabbedCube.mtxLocal.set(f.Matrix4x4.TRANSLATION(f.Vector3.Z(1.5)));
                this.addChild(this.grabbedCube);
                this.grabbedCubeBody = this.grabbedCube.getComponent(f.ComponentRigidbody);
                this.grabbedCubeBody.setVelocity(f.Vector3.ZERO());
                this.grabbedCubeBody.physicsType = f.PHYSICS_TYPE.KINEMATIC;
            }
        }
        drop() {
            PuzzleGame.cubes.addChild(this.grabbedCube);
            this.grabbedCube = undefined;
            this.grabbedCubeBody.physicsType = f.PHYSICS_TYPE.DYNAMIC;
            this.grabbedCubeBody.setVelocity(f.Vector3.ZERO());
        }
        throw() {
            this.drop();
            this.grabbedCubeBody.applyForce(f.Vector3.SCALE(f.Vector3.SUM(this.mtxLocal.getZ(), f.Vector3.SCALE(this.mtxLocal.getY(), 2)), this.throwCharge));
            this.throwCharge = 0;
        }
    }
    PuzzleGame.Avatar = Avatar;
})(PuzzleGame || (PuzzleGame = {}));
//# sourceMappingURL=Avatar.js.map