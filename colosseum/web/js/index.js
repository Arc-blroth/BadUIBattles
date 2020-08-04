"use strict";

var engine;

function main() { // called in load.js
// ----------------------------------------
//                Globals                  
// ---------------------------------------- 
engine = new Engine();
const walkSpeed = 100;
const jumpMulti = 22;
const mouseSensitivity = 0.01;
let keysPressed = {};

// ----------------------------------------
//                Content                  
// ---------------------------------------- 

engine.loadLevel("captcha");

// ----------------------------------------
//             Event Handling              
// ---------------------------------------- 
function animate(currentTime) {
    requestAnimationFrame(animate);
    
    engine.camera.updateVectors();
    if(document.hasFocus()) {
        if(engine.allowPlayerMovement) {
            if(keysPressed[87] == true) {
                engine.acceleratePlayer(engine.camera.getMoveXVec(walkSpeed));
            }
            if(keysPressed[83] == true) {
                engine.acceleratePlayer(engine.camera.getMoveXVec(-walkSpeed));
            }
            if(keysPressed[68] == true) {
                engine.acceleratePlayer(engine.camera.getMoveZVec(walkSpeed));
            }
            if(keysPressed[65] == true) {
                engine.acceleratePlayer(engine.camera.getMoveZVec(-walkSpeed));
            }
            if(keysPressed[32] == true && engine.isPlayerOnGround) {
                engine.acceleratePlayer(engine.camera.getMoveYVec(-walkSpeed * jumpMulti));
                engine.isPlayerOnGround = false;
            }
        }
        if(keysPressed[69] == true) {
            engine.onDialogAdvance();
        }
        //if(keysPressed[16] == true) {
        //    engine.camera.moveY(walkSpeed);
        //}
        document.getElementById("pos").innerHTML = vec3ToDebugString(engine.camera.pos) + "<br>" + vec3ToDebugString(glFromCannonVec3(engine.playerBody.velocity));
    } else {
        keysPressed = {};
    }
    
    engine.tick(currentTime);
    
}
requestAnimationFrame(animate);

document.onkeydown = (e) => {
    keysPressed[e.keyCode] = true;
};

document.onkeyup = (e) => {
    keysPressed[e.keyCode] = false;
};

document.onclick = () => {
    if(document.pointerLockElement === document.body || document.mozPointerLockElement === document.body) {
        engine.click();
    } else {
        document.body.requestPointerLock();
    }
};

document.onmousemove = (e) => {
    if(document.pointerLockElement === document.body || document.mozPointerLockElement === document.body) {
        if(e.movementX) {
             if(engine.allowCameraMovement) {
                engine.camera.yaw += mouseSensitivity * e.movementX;
                let pitch = engine.camera.pitch + mouseSensitivity * e.movementY;
                if(pitch >  Math.PI / 2) pitch =  Math.PI / 2;
                if(pitch < -Math.PI / 2) pitch = -Math.PI / 2;
                engine.camera.pitch = pitch;
                engine.camera.updateVectors();
             }
        }
    }
}

}; // end main function


// ----------------------------------------
//               Cheat Codes               
// ---------------------------------------- 

function tp(x, y, z) {
    engine.playerBody.position.setFromGl(glMatrix.vec3.fromValues(x, y, z));
}