"use strict";

const fixedTimeStep = 1 / 60;
const maxSubSteps = 100;

class Engine {
    
    constructor() {
        this.world = new CANNON.World();
        this.world.gravity.set(0, 9820 * 2/3, 0);
        
        this.groundMaterial = new CANNON.Material("groundMaterial");
        this.groundToGroundContact = new CANNON.ContactMaterial(this.groundMaterial, this.groundMaterial, {
            friction: 10,
            restitution: 0,
            contactEquationStiffness: 1e8,
            contactEquationRelaxation: 2,
            frictionEquationStiffness: 1,
            frictionEquationRegularizationTime: 4
        });
        this.world.addContactMaterial(this.groundToGroundContact);
        
        this.groundShape = new CANNON.Box(new CANNON.Vec3(10000, 10, 10000));
        this.groundBody = new CANNON.Body({ mass: 0, material: this.groundMaterial });
        this.groundBody.addShape(this.groundShape);
        this.world.addBody(this.groundBody);
        
        this.playerShape = new CANNON.Box(new CANNON.Vec3(100/2, 200/2, 100/2));
        this.playerBody = new CANNON.Body({ mass: 1, material: this.groundMaterial, fixedRotation: true });
        this.playerBody.position.set(0, -200, 0);
        this.playerBody.linearDamping = 0.4;
        this.playerBody.addShape(this.playerShape);
        this.world.addBody(this.playerBody);
        this.isPlayerOnGround = true;
        
        this.playerBody.addEventListener("collide", (e) => {
            if(e.contact.bj.id == this.playerBody.id) {
               if(e.contact.rj.y > 0) {
                   this.isPlayerOnGround = true;
               }
            } else {
                if(e.contact.ri.y > 0) {
                   this.isPlayerOnGround = true;
               }
            }
        });
        
        this.camera = new Camera(this.playerBody);
        
        this.uiBodies = [];
        
        this.lastTickTime = performance.now();
    }
    
    addUIBody(body) {
        this.uiBodies.push(body);
        body.body.material = this.groundMaterial;
        body.body.linearDamping = 0.2;
        this.world.addBody(body.body);
    }
    
    acceleratePlayer(glVelocity) {
        this.playerBody.velocity.setFromGl(glMatrix.vec3.add(
            glMatrix.vec3.create(),
            glFromCannonVec3(this.playerBody.velocity),
            glVelocity
        ));
    }
    
    tick(currentTime) {
        let dt = (currentTime - this.lastTickTime) / 1000;
        this.world.step(fixedTimeStep, dt, maxSubSteps);
        
        this.playerBody.velocity.x *= 0.93;
        this.playerBody.velocity.z *= 0.93;
        this.playerBody.acceleratedThisTick = false;
        this.camera.pos = glFromCannonVec3(this.playerBody.position);
        
        this.uiBodies.forEach(uiBody => {
            uiBody.updateTransform(this.camera);
        });
        
        this.lastTickTime = currentTime;
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
        this.perspective = glMatrix.mat4.perspective(glMatrix.mat4.create(), Math.PI / 800, 1, 0.1, 10);
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
    
    getViewPerspectiveMatrix() {
        let view = glMatrix.mat4.lookAt(glMatrix.mat4.create(), this.pos, glMatrix.vec3.add(glMatrix.vec3.create(), this.pos, this.front), this.up);
        return glMatrix.mat4.multiply(glMatrix.mat4.create(), this.perspective, view);
    }
    
    getMoveXVec(amount) {
        return glMatrix.vec3.scale(glMatrix.vec3.create(), this.movementFront, amount);
    }
    
    getMoveYVec(amount) {
        return [0, amount, 0];
    }
    
    getMoveZVec(amount) {
        let tempPos = glMatrix.vec3.scale(glMatrix.vec3.create(), this.right, amount);
        tempPos[1] = 0;
        return tempPos;
    }
    
}

class UIBody {
    
    constructor(domElement, width, height) {
        this.domElement = domElement;
        this.containerElement = document.createElement("div");
        this.containerElement.classList.add("uibody-container");
        document.body.append(this.containerElement);
        this.containerElement.append(this.domElement);
        
        this.width = width || this.domElement.offsetWidth || 100;
        this.height = height || this.domElement.offsetHeight || 100;
        
        this.shape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, 0.5));
        this.body = new CANNON.Body({ mass: 0 });
        this.body.addShape(this.shape);
        
        this.positionVal = glMatrix.vec3.create();
        this.rotationVal = glMatrix.quat.fromEuler(glMatrix.quat.create(), 0, 0, 0);
        this.scale = glMatrix.vec3.fromValues(1, 1, 1);
    }
    
    updateTransform(camera) {
        this.positionVal = glFromCannonVec3(this.body.position);
        this.rotationVal[0] = this.body.quaternion.x;
        this.rotationVal[1] = this.body.quaternion.y;
        this.rotationVal[2] = this.body.quaternion.z;
        this.rotationVal[3] = this.body.quaternion.w;
        
        let model = glMatrix.mat4.fromRotationTranslationScale(glMatrix.mat4.create(), this.rotationVal, this.positionVal, this.scale);
        let viewPerspective = camera.getViewPerspectiveMatrix();
        let mvp = glMatrix.mat4.multiply(glMatrix.mat4.create(), viewPerspective, model);
        this.containerElement.style.transform = mat4ToCss(mvp);
        let actualOffsetWidth = (window.innerWidth - this.domElement.offsetWidth) / 2;
        let actualOffsetHeight = (window.innerHeight - this.domElement.offsetHeight) / 2;
        this.domElement.style.transform = `translate(${actualOffsetWidth}px, ${actualOffsetHeight}px)`;
    }
    
    get width() {
        return this.domElement.offsetWidth;
    }
    
    get height() {
        return this.domElement.offsetHeight;
    }
    
    set width(width) {
        this.domElement.style.width = width + "px";
    }
    
    set height(height) {
        this.domElement.style.height = height + "px";
    }
    
    get position() {
        return this.positionVal;
    }
    
    get rotation() {
        return this.rotationVal;
    }
    
    set position(position) {
        this.body.position.set(position[0], position[1], position[2]);
        this.positionVal = position;
    }
    
    set rotation(rotation) {
        this.body.quaternion.set(rotation[0], rotation[1], rotation[2], rotation[3]);
        this.rotationVal = rotation;
    }
    
}