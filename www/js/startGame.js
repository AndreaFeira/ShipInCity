var engine;
var scene;
var canvas;
var camera, ship, ground;

document.addEventListener("DOMContentLoaded", function () {
    onload();
}, false);

/**
* Onload function : creates the babylon engine and the scene
*/
var onload = function () {
    // Engine creation
    canvas = document.getElementById("renderCanvas");
    engine = new BABYLON.Engine(canvas, true);

    // Scene creation
    initScene();

    engine.runRenderLoop(function () {
            if (! ship.killed) {
                ship.move();

                camera.position.z += ship.speed;
                ship.position.z += ship.speed;
                ground.position.z += ship.speed;
            }
        scene.render();
    });
};

var initScene = function() {
    // The scene creation
    scene = new BABYLON.Scene(engine);

    // The camera creation
    camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0, 5, -30), scene);
    camera.setTarget(new BABYLON.Vector3(0,0,20));
    camera.maxZ = 1000;
    camera.speed = 4;

    // Hemispheric light to enlight the scene
    var h = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 0.5, 0), scene);
    h.intensity = 0.6;

    // A directional light to add some colors
    var d = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(0,-0.5,0.5), scene);
    d.position = new BABYLON.Vector3(0.1,100,-100);
    d.intensity = 0.4;
    // Purple haze, all around !
    d.diffuse = BABYLON.Color3.FromInts(204,196,255);

    // ground
    ground = BABYLON.Mesh.CreateGround("ground", 800, 2000, 2, scene);

    // ship
    ship = new Ship(1, scene);
};

var randomNumber = function (min, max) {
    if (min == max) {
        return (min);
    }
    var random = Math.random();
    return ((random * (max - min)) + min);
};

var box = function() {
    var minZ = camera.position.z+500;
    var maxZ = camera.position.z+1500;
    var minX = camera.position.x - 100, maxX = camera.position.x+100;
    var minSize = 2, maxSize = 10;

    var randomX, randomZ, randomSize;

    randomX = randomNumber(minX, maxX);
    randomZ = randomNumber(minZ, maxZ);
    randomSize = randomNumber(minSize, maxSize);

    var b = BABYLON.Mesh.CreateBox("bb", randomSize, scene);

    b.scaling.x = randomNumber(0.5, 1.5);
    b.scaling.y = randomNumber(4, 8);
    b.scaling.z = randomNumber(2, 3);

    b.position.x = randomX;
    b.position.y = b.scaling.y/2 ;
    b.position.z = randomZ;
    
    // We must create a new ActionManager for our building in order to use Actions.
    b.actionManager = new BABYLON.ActionManager(scene);

    // The trigger is OnIntersectionEnterTrigger
    var trigger = {trigger:BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: ship};
    
    // Our first action !
    var sba = new BABYLON.SwitchBooleanAction(trigger, ship, "killed");
    b.actionManager.registerAction(sba);
    
    // condition : ammo > 0
    var condition = new BABYLON.ValueCondition(b.actionManager, ship, "ammo", 0, BABYLON.ValueCondition.IsGreater);

    var onpickAction = new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPickTrigger,
        function(evt) {
            if (evt.meshUnderPointer) {
                // Find the clicked mesh
                var meshClicked = evt.meshUnderPointer;
                // Detroy it !
                meshClicked.dispose();
                // Reduce the number of ammo by one
                ship.ammo -= 1;
                // Update the ammo label
                ship.sendEvent();
            }
        },
        condition);

b.actionManager.registerAction(onpickAction);
};

setInterval(box, 100);

scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
scene.fogDensity = 0.01;
