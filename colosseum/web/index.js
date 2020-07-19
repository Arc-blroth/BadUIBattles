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
let angle = 0;
let model = glMatrix.mat4.create();

//glMatrix.mat4.perspective(glMatrix.mat4.create(), Math.PI / 8, 1, 0.1, 10)
function animate() {
    requestAnimationFrame(animate);
    angle += 0.01;
    let projection = glMatrix.mat4.fromTranslation(glMatrix.mat4.create(), [window.innerWidth / 2, window.innerHeight / 2, 0]);
    let view = glMatrix.mat4.lookAt(glMatrix.mat4.create(), [50 * Math.sin(angle), 10, 50 * Math.cos(angle)], [0, 0, 0], [0, 1, 0]);
    let mvp = glMatrix.mat4.multiply(glMatrix.mat4.create(), glMatrix.mat4.multiply(glMatrix.mat4.create(), projection, view), model);
    ele.style.transform = mat4ToCss(mvp);
}

requestAnimationFrame(animate);

function mat4ToCss(matrix) {
    let out = "matrix3d(";
    for(let i = 0; i < 15; i++) {
        out += matrix[i] + ",";
    }
    out += matrix[15] + ")";
    return out;
}