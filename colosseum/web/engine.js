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

class UIBody {
    
    constructor(domElement) {
        this.domElement = domElement;
    }
    
}