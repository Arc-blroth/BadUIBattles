"use strict";

window.levels["prologue"].controllerClass = class extends LevelController {
    
    init() {
        this.startTick = engine.currentTick;
        this.dialogPosition = 0;
        this.engine.allowPlayerMovement = false;
        this.cursor = document.getElementById("cursor");
        this.windowTerminal = document.getElementById("window-terminal");
        this.windowInterwebz = document.getElementById("window-interwebz");
        this.toolbarTerminal = document.getElementById("toolbar-terminal");
        this.toolbarInterwebz = document.getElementById("toolbar-interwebz");
        this.xfceClock = document.getElementById("xfce-clock");
        
        this.dialogHelper = new DialogHelper(this.engine, [
            ["1:20 AM", "Its past midnight, and you're the last one in the office.\nClick and move the mouse to look around. Press E to advance dialog.\n\n(The UI will get worse as we go on)"],
            "It had been nearly 2 weeks since management introduced \"agile\" development into your life. Ever since, between sprint meetings and something SCRUMmy, you've found yourself working later, and also more tired.",
            "Though that last one might have something to do with your new coffee addiction.",
            ["1:21 AM", "Either way, the end of the sprint was tommorow, and you still haven't finished the last webpage yet."],
            "The client was some sort of local burger joint, who had wanted an upgrade from their old website.",
            "You immediately knew that there was an opportunity to make a great product there - but the SCRUM master decreed a simple Bootstrap website would do.",
            ["1:22 AM", "And now, here you were, staring at a mess of broken CSS. So much for agility it seemed."]
        ]);
        this.dialogHelper.startDialog();
    }
    
    tick(currentTime, currentTick) {
        
    }
    
    onDialogAdvance() {
        if(!this.dialogHelper.isDone()) {
            this.dialogHelper.onDialogAdvance();
        }
        if(this.dialogHelper.dialogPosition == 3) {
            this.xfceClock.innerHTML = "1:21 AM";
        }
        if(this.dialogHelper.dialogPosition == 6) {
            this.xfceClock.innerHTML = "1:22 AM";
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
        } else if(win == "interwebz") {
            this.windowInterwebz.classList.add("xfce-window-selected");
            this.toolbarInterwebz.classList.add("selected");
        }
    }
    
}