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

let ele = document.createElement("div");
ele.classList.add("test");
document.body.append(ele);
let model = glMatrix.mat4.fromTranslation(glMatrix.mat4.create(), [0, 0, 0]);
let playerPos = [0, 0, 300];
let cameraFront = [0, 0, -1];
let cameraUp = [0, 1, 0];
let yaw = -Math.PI/2;
let pitch = 0;
let walkSpeed = 10;
let mouseSensitivity = 0.01;
let keysPressed = {};

//glMatrix.mat4.perspective(glMatrix.mat4.create(), Math.PI / 8, 1, 0.1, 10)
function animate() {
    requestAnimationFrame(animate);
    
    cameraFront[0] = Math.cos(yaw) * Math.cos(pitch);
    cameraFront[1] = Math.sin(pitch);
    cameraFront[2] = Math.sin(yaw) * Math.cos(pitch);
    cameraFront = glMatrix.vec3.normalize(glMatrix.vec3.create(), cameraFront);
    let cameraRight = glMatrix.vec3.normalize(glMatrix.vec3.create(), glMatrix.vec3.cross(glMatrix.vec3.create(), cameraFront, [0, 1, 0]));
    cameraUp = glMatrix.vec3.normalize(glMatrix.vec3.create(), glMatrix.vec3.cross(glMatrix.vec3.create(), cameraRight, cameraFront));
    let previousY = playerPos[1];
    if(keysPressed["w"] == true) {
        playerPos = glMatrix.vec3.add(glMatrix.vec3.create(), playerPos, glMatrix.vec3.scale(glMatrix.vec3.create(), cameraFront, walkSpeed));
    }
    if(keysPressed["s"] == true) {
        playerPos = glMatrix.vec3.subtract(glMatrix.vec3.create(), playerPos, glMatrix.vec3.scale(glMatrix.vec3.create(), cameraFront, walkSpeed));
    }
    if(keysPressed["a"] == true) {
        playerPos = glMatrix.vec3.subtract(glMatrix.vec3.create(), playerPos, glMatrix.vec3.scale(glMatrix.vec3.create(), cameraRight, walkSpeed));
    }
    if(keysPressed["d"] == true) {
        playerPos = glMatrix.vec3.add(glMatrix.vec3.create(), playerPos, glMatrix.vec3.scale(glMatrix.vec3.create(), cameraRight, walkSpeed));
    }
    playerPos[1] = previousY;
    let view = glMatrix.mat4.lookAt(glMatrix.mat4.create(), playerPos, glMatrix.vec3.add(glMatrix.vec3.create(), playerPos, cameraFront), cameraUp);
    let mvp = glMatrix.mat4.multiply(glMatrix.mat4.create(), view, model);
    ele.style.transform = mat4ToCss(window.innerWidth / 2, mvp);
}

requestAnimationFrame(animate);

function mat4ToCss(perspective, matrix) {
    let out = `perspective(${perspective}px) matrix3d(`;
    for(let i = 0; i < 15; i++) {
        out += matrix[i] + ",";
    }
    out += matrix[15] + ")";
    return out;
}

document.onkeydown = (e) => {
    keysPressed[e.key] = true;
};

document.onkeyup = (e) => {
    keysPressed[e.key] = false;
};

document.onclick = () => {
    document.body.requestPointerLock = document.body.requestPointerLock || document.body.mozRequestPointerLock;
    document.body.requestPointerLock();
}

document.onmousemove = (e) => {
    if(document.pointerLockElement === document.body || document.mozPointerLockElement === document.body) {
        yaw += mouseSensitivity * e.movementX;
        pitch += mouseSensitivity * e.movementY;
        if(pitch >  Math.PI / 2 - 0.01) pitch =  Math.PI / 2 - 0.01;
        if(pitch < -Math.PI / 2 + 0.01) pitch = -Math.PI / 2 + 0.01;
    }
}