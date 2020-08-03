"use strict";

window.levels["prologue"].controllerClass = class extends LevelController {
    
    init() {
        this.startTick = engine.currentTick;
        this.dialogPosition = 0;
        this.engine.allowPlayerMovement = false;
        this.cursor = document.getElementById("cursor");
        this.monitor = document.getElementById("prologue-monitor");
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
        this.dialogHelper2 = new DialogHelper(this.engine, [
            ["1:23 AM", "Perfection."],
            "...",
            "...",
            ["1:24 AM", "ZZzz..."],
            "...",
            ["1:25 AM", "..."]
        ]);
        this.isRunningVim = false;
        this.finalAnimationStarted = false;
        this.finalDialogStarted = false;
        this.finalFinalAnimationStarted = false;
        this.finalAnimationBlindness = 0;
        loadXML("/cheeseburger.html").then(html => {
            this.cheeseburgerSrc = html;
            this.interwebzFrame.srcdoc = this.cheeseburgerSrc;
            this.vimHighlighter = new VimHighlighter(this.emulator);
            this.dialogHelper.startDialog();
        });
        hljs.configure({useBR: true});
    }
    
    tick(currentTime, currentTick) {
        if(this.isRunningVim) {
            if(this.lastTerminalText != this.terminalText) {
                this.emulator.innerHTML = this.vimHighlighter.updateHighlighting(this.terminalText);
                hljs.highlightBlock(this.emulator);
                this.lastTerminalText = this.terminalText;
            }
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
        if(this.dialogHelper2.isDone() && this.finalFinalAnimationStarted) {
            if(this.finalAnimationBlindness < 1) {
                this.finalAnimationBlindness += 1/120;
                    this.monitor.style.filter = `contrast(${1 - this.finalAnimationBlindness}) brightness(${1 + this.finalAnimationBlindness})`;
            } else {
                engine.loadLevel("testing-room");
            }
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
            setTimeout(() => {
                let interval = setInterval(() => {
                    if(this.vimHighlighter.y < 34) {
                        this.vimHighlighter.y++;
                        this._forceVimRefresh();
                    } else {
                        clearInterval(interval);
                    }
                }, 75);
                this.vimHighlighter.y++;
                this._forceVimRefresh();
            }, 500);
        }
        if(this.dialogHelper.dialogPosition == 5) {
            setTimeout(() => {
                let interval = setInterval(() => {
                    if(this.vimHighlighter.y != 28) {
                        this.vimHighlighter.y--;
                        this._forceVimRefresh();
                    } else {
                        clearInterval(interval);
                    }
                }, 120);
                this.vimHighlighter.y--;
                this._forceVimRefresh();
            }, 500);
        }
        if(this.dialogHelper.dialogPosition == 6) {
            this.xfceClock.innerHTML = "1:22 AM";
        }
        if(!this.finalAnimationStarted && this.dialogHelper.isDone()) {
            this.finalAnimationStarted = true;
            setTimeout(() => {
                 this.vimHighlighter.x++;
                 let movedToPosYet = false;
                 let fixProgress = 0;
                 let wProgress = 0;
                 let interval = setInterval(() => {
                    if(!movedToPosYet && this.vimHighlighter.x < 16) {
                        this.vimHighlighter.x++;
                        this._forceVimRefresh();
                    } else {
                        movedToPosYet = true;
                        if(fixProgress < `\n</section>\n`.length) {
                            fixProgress++;
                            this.vimHighlighter.x++;
                            this.vimHighlighter.isInsert = true;
                            this.terminalText = this.cheeseburgerSrc
                                .replace(/^ {12}<\/div>/m, `$&` + `\n         </section>`.substring(0, 9 + fixProgress));
                            this._forceVimRefresh();
                            if(fixProgress == 1) {
                                this.vimHighlighter.y++;
                                this.vimHighlighter.x = 9;
                            }
                        } else if(wProgress < 24) {
                            wProgress++;
                            if(wProgress == 10) {
                                this.vimHighlighter.isInsert = false;
                                this.vimHighlighter.isCommand = true;
                                this.vimHighlighter.commandText = "";
                            }
                            if(wProgress == 12) this.vimHighlighter.commandText += ":";
                            if(wProgress == 14) this.vimHighlighter.commandText += "w";
                            if(wProgress == 16) this.vimHighlighter.commandText += "q";
                            if(wProgress == 18) {
                                this.vimHighlighter.commandText = `cheeseburger.html ${this.terminalText.split("\n").length}L, ${this.terminalText.length}C written`;
                            }
                            if(wProgress == 24) {
                                this.cheeseburgerSrc = this.terminalText;
                                this.vimHighlighter.isCommand = false;
                                this.terminalText = "[arc@blroth ~/cheeseburger/]$ vim cheeseburger.html\n\n[arc@blroth ~/cheeseburger/]$ ";
                                this.isRunningVim = false;
                            }
                            this._forceVimRefresh();
                        } else {
                            clearInterval(interval);
                            setTimeout(() => {
                                let interwebzMenu = document.getElementById("interwebz-menu");
                                let reload = document.getElementById("reload");
                                this._setCursorPos(
                                    this.windowInterwebz.offsetLeft + interwebzMenu.offsetLeft + reload.offsetLeft,
                                    this.windowInterwebz.offsetTop + interwebzMenu.offsetTop + reload.offsetTop
                                );
                                 setTimeout(() => {
                                     this._toggleWindow("interwebz");
                                     this.interwebzFrame.srcdoc = this.cheeseburgerSrc;
                                     setTimeout(() => {
                                         this.finalDialogStarted = true;
                                         this.dialogHelper2.startDialog();
                                     }, 1750);
                                 }, 1750);
                            }, 2000);
                        }
                    }
                 }, 100);
            }, 750);
        }
        if(this.finalDialogStarted && !this.dialogHelper2.isDone()) {
            this.dialogHelper2.onDialogAdvance();
            this.xfceClock.innerHTML = "1:23 AM";
        }
        if(this.dialogHelper2.dialogPosition == 2) {
            document.body.style.filter = `blur(1px)`;
        }
        if(this.dialogHelper2.dialogPosition == 3) {
            this.xfceClock.innerHTML = "1:24 AM";
            document.body.style.filter = `blur(3px)`;
        }
        if(this.dialogHelper2.dialogPosition == 4) {
            this.xfceClock.innerHTML = "1:24 AM";
            document.body.style.filter = `blur(5px)`;
        }
        if(this.dialogHelper2.dialogPosition == 5) {
            this.xfceClock.innerHTML = "1:26 AM";
            document.body.style.filter = `blur(8px)`;
            this.finalFinalAnimationStarted = true;
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
        this.scroll = 1;
        this.isInsert = false;
        this.isCommand = false;
        this.commandText = "";
        this.lastKeyPressed = "";
    }
    
    updateHighlighting(sanitizedText) {
        // Warning to modders:
        // this code is slightly broken, but its never seen in-game.
        let linesDisplayable = Math.floor(this.textarea.offsetHeight / getComputedStyle(this.textarea).lineHeight.slice(0, -2));
        let charWidth = getComputedStyle(this.textarea).fontSize.slice(0, -2) / 1.8;
        let lineWidth = Math.floor(this.textarea.offsetWidth / charWidth);
        let lines = sanitizedText.split("\n").map(l => l.length < lineWidth ? l : l.match(new RegExp('.{1,' + lineWidth + '}', 'g'))).flat();
        let totalLines = lines.length;
        this.y = Math.max(0, Math.min(this.y, totalLines));
        if(this.y - this.scroll > linesDisplayable * 0.75 && this.scroll - 1 < totalLines - linesDisplayable + 1) {
            this.scroll++;
        }
        lines = lines.slice(this.scroll - 1, this.scroll - 1 + linesDisplayable - 1);
        let selectedLine = lines[this.y - 1];
        lines = lines.map(l => l.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "\n"));
        let cursorLoc = `${this.x},${this.y}`;
        let documentLoc = "";
        let modeText = this.isInsert ? "-- INSERT --" : this.isCommand ? this.commandText : "";
        if(this.scroll == 1) {
            documentLoc = "Top";
        } else if(this.scroll - 1 >= totalLines - linesDisplayable + 1) {
            documentLoc = "Bot";
        } else {
            documentLoc = ((this.scroll - 1) / (totalLines - linesDisplayable + 1) * 100).toFixed(0) + "%";
        }
        let footer = modeText.concat(
            this.lastKeyPressed.padEnd(9)
            .concat(cursorLoc).concat("         ")
            .concat(documentLoc).concat(" ")
            .padStart(lineWidth - modeText.length)
        ).replace(/ /g, " ");
        let mainCode = `<pre>` + lines.join(`<br>`) + `<br>` + footer + `</pre>`;
        let cursorX = this.isCommand ? this.commandText.length : this.x - 1;
        let cursorY = this.isCommand ? linesDisplayable - 1 : this.y - this.scroll;
        let highlight = `<span class="bg-white" style="position: absolute; top: 0px; transform: translate(${cursorX * charWidth}px, ${cursorY * 100}%);">&nbsp;</span>`;
        return mainCode + highlight;
    }
    
}