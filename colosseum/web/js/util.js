"use strict";

function mat4ToCss(matrix) {
    let out = `matrix3d(`;
    for(let i = 0; i < 15; i++) {
        out += matrix[i] + ",";
    }
    out += matrix[15] + ")";
    return out;
}

function vec3ToDebugString(vec3) {
    return `${vec3[0].toFixed(2)}, ${vec3[1].toFixed(2)}, ${vec3[2].toFixed(2)}`;
}

function glFromCannonVec3(cannonVec3) {
    return glMatrix.vec3.fromValues(cannonVec3.x, cannonVec3.y, cannonVec3.z);
}

CANNON.Vec3.fromGl = function(glVec3) {
    return new CANNON.Vec3(glVec3[0], glVec3[1], glVec3[2]);
}

CANNON.Vec3.prototype.setFromGl = function(glVec3) {
    this.set(glVec3[0], glVec3[1], glVec3[2]);
}