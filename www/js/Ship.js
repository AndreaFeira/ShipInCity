/**
* A mesh representing the player ship
* @param size The ship size
* @param scene The scene where the ship will be created
* @constructor
*/
Ship = function(size, scene) {
    // Call the super class BABYLON.Mesh
    BABYLON.Mesh.call(this, "ship", scene);
    // Creates a box (yes, our ship will be a box)
    var vd = BABYLON.VertexData.CreateBox(size);
    // Apply the box shape to our mesh
    vd.applyToMesh(this, false);

    // Our ship is all fresh (for now)
    this.killed = false;
    // It has 3 bullets to destroy buildings
    this.ammo = 3;

    // Its position is in (0,0), and a little bit above the ground.
    this.position.x = 0;
    this.position.z = 0;
    this.position.y = size/2;

    // Movement attributes
    this.speed = 3;
    this.moveLeft = false;
    this.moveRight = false;
    
};

// Our object is a BABYLON.Mesh
Ship.prototype = Object.create(BABYLON.Mesh.prototype);
// And its constructor is the Ship function described above.
Ship.prototype.constructor = Ship;


Ship.prototype._initMovement = function() {

    // When a key is pressed, set the movement
    var onKeyDown = function(evt) {
        // To the left
        if (evt.keyCode == 37) {
            ship.moveLeft = true;
            ship.moveRight = false;
        } else if (evt.keyCode == 39) {
            // To the right
            ship.moveRight = true;
            ship.moveLeft = false;
        }
    };

    // On key up, reset the movement
    var onKeyUp = function(evt) {
        ship.moveRight = false;
        ship.moveLeft = false;
    };

    // Register events with the right Babylon function
    BABYLON.Tools.RegisterTopRootEvents([{
        name: "keydown",
        handler: onKeyDown
    }, {
        name: "keyup",
        handler: onKeyUp
    }]);
};

Ship.prototype.move = function() {
    if (ship.moveRight) {
        ship.position.x += 1;
        camera.position.x += 1;
    }
    if (ship.moveLeft) {
        ship.position.x += -1;
        camera.position.x += -1;
    }
};

// Send the event ammo updated
Ship.prototype.sendEvent = function() {
    var e = new Event('ammoUpdated');
    window.dispatchEvent(e);
};

// Create the event hook
Ship.prototype._initLabelUpdate = function() {
    // Update the html part
    var updateAmmoLabel = function() {
        document.getElementById("ammoLabel").innerHTML = "AMMO : "+ship.ammo;
    };

    BABYLON.Tools.RegisterTopRootEvents([{
        name:"ammoUpdated",
        handler : updateAmmoLabel
    }]);
};