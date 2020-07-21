"use strict";

// ----------------------------------------
//          Imports and Polyfills          
// ----------------------------------------

// ----------------------------------------
//                Globals                  
// ---------------------------------------- 
let engine = new Engine();

// ----------------------------------------
//             Event Handling              
// ---------------------------------------- 

let camera = new Camera();
let walkSpeed = 20;
let mouseSensitivity = 0.01;
let keysPressed = {};
let ele1 = document.createElement("div");
ele1.classList.add("test1");
let ele1Body = new UIBody(ele1);
let ele2 = document.createElement("div");
ele2.classList.add("test2");
let ele2Body = new UIBody(ele2);
let ele3 = document.createElement("div");
ele3.classList.add("test1");
let ele3Body = new UIBody(ele3);

ele1Body.position[2] = -1000;
ele2Body.position[2] = -1000;
ele2Body.position[1] = -1000;
ele3Body.position[0] = -1500;
ele3Body.position[2] =   500;
ele3Body.rotation = glMatrix.quat.fromEuler(glMatrix.quat.create(), 0, 90, 0);

//glMatrix.mat4.perspective(glMatrix.mat4.create(), Math.PI / 8, 1, 0.1, 10)
function animate() {
    requestAnimationFrame(animate);
    
    camera.updateVectors();
    if(document.hasFocus()) {
        if(keysPressed[87] == true) {
            camera.moveX(walkSpeed);
        }
        if(keysPressed[83] == true) {
            camera.moveX(-walkSpeed);
        }
        if(keysPressed[68] == true) {
            camera.moveZ(walkSpeed);
        }
        if(keysPressed[65] == true) {
            camera.moveZ(-walkSpeed);
        }
        if(keysPressed[32] == true) {
            camera.moveY(-walkSpeed);
        }
        if(keysPressed[16] == true) {
            camera.moveY(walkSpeed);
        }
        document.getElementById("pos").innerHTML = vec3ToDebugString(camera.pos) + "<br>" + vec3ToDebugString(camera.front);
    } else {
        keysPressed = {};
    }
    
    ele1Body.updateTransform(camera);
    ele2Body.updateTransform(camera);
    ele3Body.updateTransform(camera);
    
}

requestAnimationFrame(animate);

function vec3ToDebugString(vec3) {
    return `${vec3[0].toFixed(2)}, ${vec3[1].toFixed(2)}, ${vec3[2].toFixed(2)}`;
}

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
        camera.yaw += mouseSensitivity * e.movementX;
        let pitch = camera.pitch + mouseSensitivity * e.movementY;
        if(pitch >  Math.PI / 2 - 0.01) pitch =  Math.PI / 2 - 0.01;
        if(pitch < -Math.PI / 2 + 0.01) pitch = -Math.PI / 2 + 0.01;
        camera.pitch = pitch;
        camera.updateVectors();
    }
}

function tp(x, y, z) {
    camera.pos = glMatrix.vec3.fromValues(x, y, z);
}