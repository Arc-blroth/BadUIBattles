"use strict";

class Engine {
    
    constructor() {
        this.world = new CANNON.World();
        this.world.gravity.set(0, 0, -9.82);

        let groundBody = new CANNON.Body({
            mass: 0
        });
        let groundShape = new CANNON.Plane();
        groundBody.addShape(groundShape);
        this.world.addBody(groundBody);
        
        this.uiBodies = [];
    }
    
    addUIBody(body) {
        this.uiBodies.push(body);   
    }
    
}

class Camera {
    
    constructor() {
        this.pos = glMatrix.vec3.create();
        this.yaw = -Math.PI/2;
        this.pitch = 0;
        this.front = glMatrix.vec3.create();
        this.movementFront = glMatrix.vec3.create();
        this.right = glMatrix.vec3.create();
        this.up = glMatrix.vec3.create();
        this.updateVectors();
    }
    
    updateVectors() {
        this.front[0] = Math.cos(this.yaw) * Math.cos(this.pitch);
        this.front[1] = Math.sin(this.pitch);
        this.front[2] = Math.sin(this.yaw) * Math.cos(this.pitch);
        this.movementFront[0] = this.front[0];
        this.movementFront[2] = this.front[2];
        this.front = glMatrix.vec3.normalize(glMatrix.vec3.create(), this.front);
        this.movementFront = glMatrix.vec3.normalize(glMatrix.vec3.create(), this.movementFront);
        this.right = glMatrix.vec3.normalize(glMatrix.vec3.create(), glMatrix.vec3.cross(glMatrix.vec3.create(), this.front, [0, 1, 0]));
        this.up = glMatrix.vec3.normalize(glMatrix.vec3.create(), glMatrix.vec3.cross(glMatrix.vec3.create(), this.right, this.front));
    }
    
    getViewMatrix() {
        return glMatrix.mat4.lookAt(glMatrix.mat4.create(), this.pos, glMatrix.vec3.add(glMatrix.vec3.create(), this.pos, this.front), this.up);
    }
    
    moveX(amount) {
        this.pos = glMatrix.vec3.add(glMatrix.vec3.create(), this.pos, glMatrix.vec3.scale(glMatrix.vec3.create(), this.movementFront, amount));
    }
    
    moveY(amount) {
        this.pos = glMatrix.vec3.add(glMatrix.vec3.create(), this.pos, [0, amount, 0]);
    }
    
    moveZ(amount) {
        let previousY = this.pos[1];
        let tempPos = glMatrix.vec3.add(glMatrix.vec3.create(), this.pos, glMatrix.vec3.scale(glMatrix.vec3.create(), this.right, amount));
        tempPos[1] = previousY;
        this.pos = tempPos;
    }
    
}

class UIBody {
    
    constructor(domElement) {
        this.domElement = domElement;
    }
    
}