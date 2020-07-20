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
let camera = new Camera();
let walkSpeed = 10;
let mouseSensitivity = 0.01;
let keysPressed = {};

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
    } else {
        keysPressed = {};
    }
    let view = camera.getViewMatrix();
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