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
        
        this.name = rootTag.getAttribute("name") || "[Level Name]";
    }
    
    _initController() {
        let controlSrc = this.levelXML.children[0].getAttribute("controller") || null;
        if(controlSrc) {
            return this.loadScript(controlSrc).catch((error) => {
                console.error("[Level] Failed to load controller " + controlSrc);
                this.controllerClass = LevelController;
                throw "Failed to load controller " + controlSrc;
            }).then(() => {
                if(this.controllerClass === null || this.controllerClass === undefined) {
                    console.error("[Level] Failed to load controller " + controlSrc + ": "
                        + "this.controllerClass is null or undefined."
                    );
                    this.controllerClass = LevelController; 
                }
            });
        } else {
            this.controllerClass = LevelController;
            return new Promise((resolve) => { resolve() });
        }
    }
    
    load(engine) {
        let rootTag = this.levelXML.children[0];
        
        // if you're wondering why there's so many Number()'s
        // its because javascript is stupid.
        let bgColor     =        rootTag.getAttribute("bgColor")     || "#abddff";
        let playerX     = Number(rootTag.getAttribute("playerX")     || 0);
        let playerY     = Number(rootTag.getAttribute("playerY")     || 0);
        let playerZ     = Number(rootTag.getAttribute("playerZ")     || 0);
        let playerYaw   = Number(rootTag.getAttribute("playerYaw")   || -0.5);
        let playerPitch = Number(rootTag.getAttribute("playerPitch") || 0);
        engine.camera.yaw = playerYaw * Math.PI;
        engine.camera.pitch = playerPitch * Math.PI;
        document.body.style.backgroundColor = bgColor;
        
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
        
        return this.controllerClass ? new this.controllerClass(engine, this) : null;
    }
    
}

class LevelController {
    
    constructor(engine, level) {
        this.engine = engine;
        this.level = level;
    }
    
    init() {
        
    }
    
    tick(currentTime, currentTick) {
        
    }
    
    onDialogAdvance() {
        
    }
    
    destroy() {
        
    }
    
}

class DialogHelper {
    
    constructor(engine, messages) {
        this.engine = engine;
        this.messages = messages;
        this.dialogPosition = -1;
    }
    
    startDialog() {
        this.onDialogAdvance();
        this.engine.showDialog();
    }
    
    onDialogAdvance() {
        this.dialogPosition++;
        if(this.dialogPosition < this.messages.length) {
            let message = this.messages[this.dialogPosition];
            if(typeof(message) === 'string') {
                this.engine.setDialogText(message);
            } else {
                if(message.length > 1) {
                    this.engine.setDialogTitle(message[0]);
                    this.engine.setDialogText(message[1]);
                } else {
                    this.engine.setDialogText(message[0]);
                }
            }
        } else {
            this.engine.hideDialog();
        }
    }
    
    isDone() {
        return this.dialogPosition == this.messages.length + 1;
    }
    
}