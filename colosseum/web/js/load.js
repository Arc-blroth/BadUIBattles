"use strict";

// ----------------------------------------
//         Loading Screen Handler          
// ----------------------------------------
// If you're looking for the main code, see
//                index.js


// youtube script loading - these are defined
// on window so they can be yeeted later
window.isYoutubeAPILoaded = false;
window.onYouTubeIframeAPIReady = () => {
    isYoutubeAPILoaded = true;
}

// level data persists beyond load screen
window.levels = {};

(function() {
    
    // Run-length encoded logo, 99x18
    const ARCBLROTH = {};
    ARCBLROTH.image = atob("CgIcAgMDCQIkAgsEGwIDAwkCIwMKBRoDAgQIAyMDCQYaAwIDCQMbAgUECQYZAwIECAQaAwUDCQcZAwIECAMaAwUECAgGAwkDBAICBwUEBAMJBAMJAgYGAwIDBQMJBQcHBQMEAwkGAQkCCAQDAwMFBwQHBQMCBAMEBAcEBwMEBQMCAwMEAwMECAMFCAMDAwMEAwgDBAEDAgQGAwIDAwQDAwQEAgMBBQgDBAMDAwQEAgMBBAMCAgQFAwMDAgsEBAIDAQQJAwQDAwMEBAIDAQMEAgIEBQMCBAEMAwUGBAgDBAQCBAMFBgIFAgIDBQQCAwIMAwQHBAgCBQQCBAMEBwIEAwIDBQMDAwEFBAQCBQcECAIEBAMEAgUHAgMEAgMEBAIEAQQFBAIECAQIAwIEBAQCBAgDAQQDAwQEAgMCAwcDAQUJBAcIBQMCBQgHBAQDAwMDAgIIAwEECwQHBgYDAgQKBQYEAgMDAwI=");
    ARCBLROTH.width = 99;
    ARCBLROTH.height = 18;
    
    const requiredStylesheets = [
        "https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css",
        "/stylesheet.css"
    ];
    
    const requiredScripts = [
        "https://www.youtube.com/iframe_api",
        "/js/gl-matrix-min.js",
        "/js/cannon.min.js",
        "/js/util.js",
        "/js/engine.js",
        "/js/level.js",
        "/js/index.js"
    ];
    
    const requiredLevels = [
        "/mapdata/testing-room.xml",
        "/mapdata/prologue.xml"
    ];
    
    function buildElement(type, classList = []) {
        let ele = document.createElement(type);
        if(classList.length > 0) {
            classList.forEach(clazz => {
               ele.classList.add(clazz); 
            });
        }
        return ele;
    }
    
    function buildDiv(classList = []) {
        return buildElement("div", classList);
    }
    
    class ProgressBar {
        
        constructor() {
            this.track = buildDiv(["ui", "progressBar"]);
            this.bar = buildDiv();
            document.body.append(this.track);
            this.track.append(this.bar);
            this.progress = 0;
        }
        
        getProgress() {
            return this.progress;
        }
        
        setProgress(progress) {
            this.progress = progress;
            // Max progress is the edge of the screen, for badUIness
            this.bar.style.width = (progress * 100 * 85/70) + "%";
        }
        
        remove() {
            this.track.removeChild(this.bar);
            this.track.parentElement.removeChild(this.track);
        }
        
    }
    
    function redrawLogo(logoCanvas) {
        let actualWidth = getComputedStyle(logoCanvas).getPropertyValue("width").slice(0, -2);
        let actualHeight = getComputedStyle(logoCanvas).getPropertyValue("height").slice(0, -2);
        let scale = Math.ceil((actualWidth < actualHeight ? actualWidth / ARCBLROTH.width : actualHeight / ARCBLROTH.height) * window.devicePixelRatio);
        logoCanvas.width = ARCBLROTH.width * scale;
        logoCanvas.height = ARCBLROTH.height * scale;
        let logo = logoCanvas.getContext("2d");
        let logoX = -1;
        let logoY = 0;
        let zeroOrOne = false;
        for(let i = 0; i < ARCBLROTH.image.length; i++) {
            let bit = ARCBLROTH.image.charCodeAt(i);
            logo.fillStyle = zeroOrOne ? "#17c1ff" : "#0000";
            for(let j = 0; j < bit; j++) {
                logoX++;
                if(logoX > ARCBLROTH.width - 1) {
                    logoX = 0;
                    logoY++;
                }
                logo.fillRect(logoX * scale, logoY * scale, scale, scale);
            }
            zeroOrOne = !zeroOrOne;
        }
    }
    
    function loadStylesheet(styleSrc) {
        return new Promise((resolve, reject) => {
            let styleTag = buildElement('link');
            let whenLoaded = () => {
                resolve(styleSrc);
            };
            styleTag.onload = whenLoaded;
            styleTag.onreadystatechange = whenLoaded;
            styleTag.onerror = () => {
                reject(styleSrc);
            };
            styleTag.rel = "stylesheet";
            styleTag.href = styleSrc;
            document.head.append(styleTag);
        });
    }
    
    function loadScript(scriptSrc) {
        return new Promise((resolve, reject) => {
            let scriptTag = buildElement('script');
            let whenLoaded = () => {
                resolve(scriptSrc);
            };
            scriptTag.onload = whenLoaded;
            scriptTag.onreadystatechange = whenLoaded;
            scriptTag.onerror = () => {
                reject(scriptSrc);
            };
            scriptTag.src = scriptSrc;
            document.body.append(scriptTag);
        });
    }
    
    function loadLevel(levelSrc) {
        return new Promise((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if(this.status == 200) {
                        let level = new Level(this.responseXML);
                        window.levels[level.name] = level;
                        level._initController().then(() => {
                            resolve(level);
                        }, (error) => {
                            reject(error);
                        });
                    } else {
                        reject(this.status);
                    }
                }
            };
            req.open("GET", levelSrc, true);
            req.send();
        });
    }
    
    function htmlToElement(html) {
        var template = document.createElement("template");
        html = html.trim();
        template.innerHTML = html;
        return template.content.firstChild;
    }
    
    function waitForYoutubeAPI(onload) {
        if(isYoutubeAPILoaded) {
            onload();
        } else {
            setTimeout(() => { waitForYoutubeAPI(onload) }, 100);
        }
    }
    
    function load() {
        let loadScreenBg = buildDiv(["ui", "loadScreenBg"]);
        document.body.append(loadScreenBg);
        
        // Decode 
        let logoCanvas = buildElement("canvas", ["ui", "logo"]);
        document.body.append(logoCanvas);
        redrawLogo(logoCanvas);
        window.onresize = () => { redrawLogo(logoCanvas); };
        
        // 20% stylesheets | 30% scripts | 50% levels
        let progressBar = new ProgressBar();
        progressBar.setProgress(0);
        
        function onError(res, error) {
            let errorMsg = `Failed to load ${res}, please reload and try again.`;
            console.error(`Could not load all ${res}:`);
            console.error(error);
            progressBar.bar.style.backgroundColor = "#ff4a4a";
            // give the UI some time to render
            progressBar.bar.ontransitionend = () => {
                alert(errorMsg);
            };
            let posTxt = document.getElementById("pos");
            posTxt.innerHTML = errorMsg;
            posTxt.classList.add("levelLoadingFail");
        }
        
        // Load stylesheets
        // These can safely be done in parallel
        let stylesheetsDone = 0;
        Promise.all(requiredStylesheets.map(s => loadStylesheet(s).then(p => {
            progressBar.setProgress(++stylesheetsDone / (requiredStylesheets.length) * 0.2);
        }))).then(() => {
            console.log("Loaded all stylesheets!");
            
            // Load scripts
            // Because scripts depend on each other, we load them one by one
            // we start from -1 because afterScriptLoaded is called once without loading anything
            let scriptsDone = -1;
            let afterScriptLoaded = () => {
                progressBar.setProgress(++scriptsDone / (requiredScripts.length + 1) * 0.3 + 0.2);
                if(scriptsDone < requiredScripts.length) {
                    loadScript(requiredScripts[scriptsDone]).then(afterScriptLoaded, (error) => {
                        onError("scripts", error);
                    });
                } else {
                    waitForYoutubeAPI(() => {
                        progressBar.setProgress(++scriptsDone / (requiredScripts.length + 1) * 0.3 + 0.2);
                        console.log("Loaded all scripts!");
                        
                        // This prevents redefining loadScript
                        Level.prototype.loadScript = loadScript;
                        
                        // Load levels
                        let levelsDone = 0;
                        Promise.all(requiredLevels.map(s => loadLevel(s).then(p => {
                            progressBar.setProgress(++levelsDone / (requiredLevels.length) * 0.5 + 0.5);
                        }))).then(() => {
                            if(levelsDone == requiredLevels.length) {
                                console.log("Loaded all levels!");
                                
                                delete window.onYouTubeIframeAPIReady;
                                delete window.isYoutubeAPILoaded;
                                
                                // give the UI some time to render
                                progressBar.track.ontransitionend = () => {
                                    logoCanvas.style.opacity = "0%";
                                    loadScreenBg.style.opacity = "0%";
                                    progressBar.track.style.opacity = "0%";
                                    setTimeout(() => {
                                        window.onresize = () => {};
                                        logoCanvas.parentElement.removeChild(logoCanvas);
                                        progressBar.remove();
                                        loadScreenBg.parentElement.removeChild(loadScreenBg);
                                        document.body.requestPointerLock();
                                    }, 1000);
                                    progressBar.track.ontransitionend = () => {};
                                }
                                
                                // main function defined in index.js
                                main();
                            }
                        }, (error) => {
                            onError("levels", error);
                        });
                    });
                }
            };
            afterScriptLoaded();
        }, (error) => {
            onError("stylesheets", error);
        });
    }
    
    load();
    
})();