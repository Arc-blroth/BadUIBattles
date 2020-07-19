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
let perspective = 100;
let angle = 0;

//glMatrix.mat4.perspective(glMatrix.mat4.create(), Math.PI / 8, 1, 0.1, 10)
function animate() {
    requestAnimationFrame(animate);
    angle += 0.01;
    
    ele.style.transform = buildCssTransform(10000, [window.innerWidth / 2, window.innerHeight / 2, 0], [angle, angle, angle]);
}
requestAnimationFrame(animate);

function buildCssTransform(perspective, translation, rotation) {
    return `perspective(${perspective}px) translate(-50%, -50%) translate3d(${translation[0]}px,${translation[1]}px,${translation[2]}px) rotateX(${rotation[0]}rad) rotateY(${rotation[1]}rad) rotateZ(${rotation[2]}rad)`;
}