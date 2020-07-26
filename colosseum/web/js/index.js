"use strict";

// ----------------------------------------
//          Imports and Polyfills          
// ----------------------------------------

// ----------------------------------------
//                Globals                  
// ---------------------------------------- 
let engine = new Engine();
const walkSpeed = 20;
const mouseSensitivity = 0.01;
let keysPressed = {};

// ----------------------------------------
//                Content                  
// ---------------------------------------- 

let ele1 = document.createElement("div");
ele1.classList.add("test1");
let ele1Body = new UIBody(ele1, 1000, 1000);
let ele2 = document.createElement("div");
ele2.classList.add("test1");
let ele2Body = new UIBody(ele2, 1000, 1000);
let ele3 = document.createElement("div");
ele3.classList.add("test1");
let ele3Body = new UIBody(ele3, 1000, 1000);

ele1Body.position = glMatrix.vec3.fromValues(    0, -1000, -1000);
ele2Body.position = glMatrix.vec3.fromValues(-1500, -1000, - 500);
ele3Body.position = glMatrix.vec3.fromValues(-2000, -1000,  1000);
ele2Body.rotation = glMatrix.quat.fromEuler(glMatrix.quat.create(), 0, 45, 0);
ele3Body.rotation = glMatrix.quat.fromEuler(glMatrix.quat.create(), 0, 90, 0);

engine.addUIBody(ele1Body);
engine.addUIBody(ele2Body);
engine.addUIBody(ele3Body);

// ----------------------------------------
//             Event Handling              
// ---------------------------------------- 
function animate(currentTime) {
    requestAnimationFrame(animate);
    
    engine.camera.updateVectors();
    if(document.hasFocus()) {
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
        if(keysPressed[32] == true) {
            engine.acceleratePlayer(engine.camera.getMoveYVec(-walkSpeed));
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
    document.body.requestPointerLock = document.body.requestPointerLock || document.body.mozRequestPointerLock;
    document.body.requestPointerLock();
};

document.onmousemove = (e) => {
    if(document.pointerLockElement === document.body || document.mozPointerLockElement === document.body) {
        engine.camera.yaw += mouseSensitivity * e.movementX;
        let pitch = engine.camera.pitch + mouseSensitivity * e.movementY;
        if(pitch >  Math.PI / 2) pitch =  Math.PI / 2;
        if(pitch < -Math.PI / 2) pitch = -Math.PI / 2;
        engine.camera.pitch = pitch;
        engine.camera.updateVectors();
    }
}

// ----------------------------------------
//               Cheat Codes               
// ---------------------------------------- 

function tp(x, y, z) {
    engine.camera.pos = glMatrix.vec3.fromValues(x, y, z);
}