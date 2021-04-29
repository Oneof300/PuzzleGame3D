///<reference types="../libs/FudgeCore/FudgeCore.js"/>

namespace PuzzleGame {
  import f = FudgeCore;

  window.addEventListener("load", init);

  let viewport: f.Viewport;

  async function init(): Promise<void> {
    // load resources referenced in the link-tag
    await f.Project.loadResources("../scenes/StartScene.json");
    f.Debug.log("Project:", f.Project.resources);

    // load start scene
    let startSceneID: string = "Graph|2021-04-27T14:18:03.253Z|46659";
    let startScene: f.Graph = f.Project.resources[startSceneID] as f.Graph;

    // initialize physics
    f.Physics.initializePhysics();
    f.Physics.settings.debugDraw = true;

    // setup graph
    let root: f.Node = new f.Node("Root");
    startScene.getChildrenByName("Cubes")[0].getChildren().forEach(cube => {
      cube.addComponent(new f.ComponentRigidbody(100, f.PHYSICS_TYPE.DYNAMIC, f.COLLIDER_TYPE.CUBE));
    });
    startScene.getChildrenByName("Floor")[0].addComponent(new f.ComponentRigidbody(0, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE));
    root.addChild(startScene);
    root.addChild(Avatar.instance);
    f.Debug.log("Root:", root);

    // setup viewport
    let canvas: HTMLCanvasElement = document.querySelector("canvas");
    viewport = new f.Viewport();
    viewport.initialize("Viewport", root, Avatar.instance.camera, canvas);
    f.Debug.log("Viewport:", viewport);

    // setup audio
    let cmpListener: f.ComponentAudioListener = new f.ComponentAudioListener();
    Avatar.instance.camera.getContainer().addComponent(cmpListener);
    f.AudioManager.default.listenWith(cmpListener);
    f.AudioManager.default.listenTo(startScene);
    f.Debug.log("Audio:", f.AudioManager.default);

    // start game
    f.Physics.start(root);
    viewport.draw();
    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start();
  }

  function update(): void {
      f.Physics.world.simulate(f.Loop.timeFrameReal / 1000);
      viewport.draw();
  }
}