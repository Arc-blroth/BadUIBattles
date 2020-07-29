"use strict";

class Level {
    
    constructor(levelXML) {
        this.levelXML = levelXML;
        
        if(this.levelXML.children.length !== 1) {
            throw "A level source file must contain exactly 1 top-level <level> tag."
        }
        
        let rootTag = this.levelXML.children[0];
        if(rootTag.tagName !== "level") {
            throw "A level source file must contain exactly 1 top-level <level> tag."
        }
        
        this.name = rootTag.getAttribute("name")    || "[Level Name]";
    }
    
    load(engine) {
        let rootTag = this.levelXML.children[0];
        
        // if you're wondering why there's so many Number()'s
        // its because javascript is stupid.
        let playerX     = Number(rootTag.getAttribute("playerX")     || 0);
        let playerY     = Number(rootTag.getAttribute("playerY")     || 0);
        let playerZ     = Number(rootTag.getAttribute("playerZ")     || 0);
        let playerYaw   = Number(rootTag.getAttribute("playerYaw")   || -0.5);
        let playerPitch = Number(rootTag.getAttribute("playerPitch") || 0);
        engine.camera.yaw = playerYaw * Math.PI;
        engine.camera.pitch = playerPitch * Math.PI;
        
        for(let i = 0; i < rootTag.children.length; i++) {
            let bodyTag = rootTag.children[i];
            let mass   = Number(bodyTag.getAttribute("mass")   || 1);
            let width  = Number(bodyTag.getAttribute("width")  || 0);
            let height = Number(bodyTag.getAttribute("height") || 0);
            let posX   = Number(bodyTag.getAttribute("posX")   || 0);
            let posY   = Number(bodyTag.getAttribute("posY")   || 0);
            let posZ   = Number(bodyTag.getAttribute("posZ")   || 0);
            let rotX   = Number(bodyTag.getAttribute("rotX")   || 0);
            let rotY   = Number(bodyTag.getAttribute("rotY")   || 0);
            let rotZ   = Number(bodyTag.getAttribute("rotZ")   || 0);
            if(bodyTag.tagName == "uiBody") {
                let type = bodyTag.getAttribute("type");
                if(type == "youtube") {
                    let videoId = bodyTag.getAttribute("videoId") || "dQw4w9WgXcQ";
                    let body = new YoutubeUIBody(videoId, width, height);
                    body.position = glMatrix.vec3.fromValues(posX, posY, posZ);
                    body.rotation = glMatrix.quat.fromEuler(glMatrix.quat.create(), rotX, rotY, rotZ);
                    engine.addUIBody(body);
                } else {
                    // from https://davidwalsh.name/convert-html-stings-dom-nodes
                    let domElement = document.createRange().createContextualFragment(bodyTag.innerHTML.trim());
                    let body = new UIBody(domElement, width, height);
                    body.position = glMatrix.vec3.fromValues(posX, posY, posZ);
                    body.rotation = glMatrix.quat.fromEuler(glMatrix.quat.create(), rotX, rotY, rotZ);
                    engine.addUIBody(body);
                }
            } else if(bodyTag.tagName == "boxBody") {
                let depth = Number(bodyTag.getAttribute("depth") || 0);
                let fixed = bodyTag.getAttribute("fixed");
                if(fixed === null) fixed = false;
                let shape = new CANNON.Box(new CANNON.Vec3(width, height, depth));
                let body = new CANNON.Body({ mass: mass, fixedRotation: fixed });
                body.addShape(shape);
                body.position.set(posX, posY, posZ);
                body.quaternion.setFromEuler(rotX, rotY, rotZ, "XYZ");
                engine.addBody(body);
            } else {
                console.warning("[Level] Unrecognized tag: " + bodyTag.tagName);
            }
        }
    }
    
}