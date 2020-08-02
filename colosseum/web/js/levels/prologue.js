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
        this.emulator = document.getElementById("emulator");
        this.interwebzFrame = document.getElementById("interwebz-frame");
        this.xfceClock = document.getElementById("xfce-clock");
        
        this.lastTerminalText = "";
        this.terminalText = "[arc@blroth ~/cheeseburger/]$ vim cheeseburger.html";
        this._toggleWindow("terminal");
        this._setCursorPos(155, 80);
        this.dialogHelper = new DialogHelper(this.engine, [
            ["1:20 AM", "Its past midnight, and you're the last one in the office.\nClick inside the page, then move the mouse to look around. Press E to advance dialog.\n\n(The UI will get worse as we go on)"],
            "It had been nearly 2 weeks since management introduced \"agile\" development into your life. Ever since, between sprint meetings and something SCRUMmy, you've found yourself working later, and also more tired.",
            "Though that last one might have something to do with your new coffee addiction.",
            ["1:21 AM", "Either way, the end of the sprint was tommorow, and you still haven't finished the last webpage yet."],
            "The client was some sort of local burger joint, who had wanted an upgrade from their old website.",
            "You immediately knew that there was an opportunity to make a great product there - but the SCRUM master decreed a simple Bootstrap website would do.",
            ["1:22 AM", "And now, here you were, staring at a mess of broken divs. So much for agility it seemed."]
        ]);
        this.isRunningVim = false;
        loadXML("/cheeseburger.html").then(html => {
            this.cheeseburgerSrc = html;
            this.interwebzFrame.srcdoc = this.cheeseburgerSrc;
            this.vimHighlighter = new VimHighlighter(this.emulator);
            this.dialogHelper.startDialog();
        });
        hljs.configure({useBR: true});
    }
    
    tick(currentTime, currentTick) {
        if(this.lastTerminalText != this.terminalText) {
            if(this.isRunningVim) {
                console.log("updating");
                this.emulator.innerHTML = this.vimHighlighter.updateHighlighting(this.terminalText);
                hljs.highlightBlock(this.emulator);
            } else {
                let sanitizedText = this.terminalText
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/\n/g, "<br>")
                    .replace(/ /g, "&nbsp;");
                if(currentTime % 1000 < 500) {
                    this.emulator.innerHTML = sanitizedText + `<span class="bg-white">&nbsp;</span>`;
                } else {
                    this.emulator.innerHTML = sanitizedText;
                }
            }
            this.lastTerminalText = this.terminalText;
        }
    }
    
    onDialogAdvance() {
        if(!this.dialogHelper.isDone()) {
            this.dialogHelper.onDialogAdvance();
        }
        if(this.dialogHelper.dialogPosition == 1) {
            this.terminalText += "\n";
            setTimeout(() => {
                this.terminalText = this.cheeseburgerSrc;
                this.isRunningVim = true;
            }, 250);
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
    
    _setCursorPos(x, y) {
        this.cursor.style.transform = `translate(${x}px, ${y}px)`;
    }
    
    _forceVimRefresh() {
        this.lastTerminalText = "";
    }
    
}

class VimHighlighter {
    
    constructor(textarea) {
        this.textarea = textarea;
        // wait its 1-indexed? heresy.
        this.x = 1;
        this.y = 1;
        this.scroll = 10;
        this.isInsert = true;
        this.lastKeyPressed = "";
    }
    
    updateHighlighting(sanitizedText) {
        let outputText = "";
        let linesDisplayable = Math.floor(this.textarea.offsetHeight / getComputedStyle(this.textarea).lineHeight.slice(0, -2));
        let lineWidth = Math.floor(this.textarea.offsetWidth / getComputedStyle(this.textarea).fontSize.slice(0, -2) * 1.8);
        let lines = sanitizedText.split("\n").map(l => l.length < lineWidth ? l : l.match(new RegExp('.{1,' + lineWidth + '}', 'g'))).flat();
        let totalLines = lines.length;
        lines = lines.slice(this.scroll - 1, this.scroll - 1 + linesDisplayable - 1);
        lines = lines.map(l => l.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "\n"));
        let cursorLoc = `${this.x},${this.y}`;
        let documentLoc = "";
        let modeText = this.isInsert ? "-- INSERT --" : "";
        if(this.scroll == 1) {
            documentLoc = "Top";
        } else if(this.scroll > totalLines - linesDisplayable * 0.75) {
            documentLoc = "Bot";
        } else {
            documentLoc = ((this.scroll - 1) / (totalLines - linesDisplayable * 0.75) * 100).toFixed(0) + "%";
        }
        let footer = modeText.concat(
            this.lastKeyPressed.padEnd(9)
            .concat(cursorLoc).concat("         ")
            .concat(documentLoc).concat(" ")
            .padStart(lineWidth - modeText.length)
        ).replace(/ /g, " ");
        return `<pre>` + lines.join("<br>") + "<br>" + footer + `</pre>`;
    }
    
}