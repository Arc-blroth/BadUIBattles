"use strict";

window.levels["prologue"].controllerClass = class extends LevelController {
    
    init() {
        this.startTick = engine.currentTick;
        //this.engine.allowPlayerControl = false;
        this.cursor = document.getElementById("cursor");
        this.windowTerminal = document.getElementById("window-terminal");
        this.windowInterwebz = document.getElementById("window-interwebz");
        this.toolbarTerminal = document.getElementById("toolbar-terminal");
        this.toolbarInterwebz = document.getElementById("toolbar-interwebz");
    }
    
    tick(currentTime, currentTick) {
        if(currentTick - this.startTick == 1) {
            this.cursor.style.transform = "translate(100px, 100px)";
            this._toggleWindow("terminal");
        } 
        if(currentTick - this.startTick == 60) {
            this.cursor.style.transform = "translate(0px, 0px)";
            this._toggleWindow("none");
        }
    }
    
    _toggleWindow(win) {
        this.windowTerminal.classList.remove("xfce-window-selected");
        this.toolbarTerminal.classList.remove("selected");
        this.windowInterwebz.classList.remove("xfce-window-selected");
        this.toolbarInterwebz.classList.remove("selected");
        if(win == "terminal") {
            this.windowTerminal.classList.add("xfce-window-selected");
            this.toolbarTerminal.classList.add("selected");
        } else {
            this.windowInterwebz.classList.remove("xfce-window-selected");
            this.toolbarInterwebz.classList.remove("selected");
        }
    }
    
}