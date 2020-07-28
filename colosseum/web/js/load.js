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

(function() {
    
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
        "/js/index.js"
    ];
    
    function buildDiv(classList = []) {
        let div = document.createElement("div");
        if(classList.length > 0) {
            classList.forEach(clazz => {
               div.classList.add(clazz); 
            });
        }
        return div;
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
    
    function loadStylesheet(styleSrc) {
        return new Promise((resolve, reject) => {
            let styleTag = document.createElement('link');
            let whenLoaded = () => {
                resolve(styleSrc);
            };
            styleTag.onload = whenLoaded;
            styleTag.onreadystatechange = whenLoaded;
            styleTag.rel = "stylesheet";
            styleTag.href = styleSrc;
            document.head.append(styleTag);
        });
    }
    
    function loadScript(scriptSrc) {
        return new Promise((resolve, reject) => {
            let scriptTag = document.createElement('script');
            let whenLoaded = () => {
                resolve(scriptSrc);
            };
            scriptTag.onload = whenLoaded;
            scriptTag.onreadystatechange = whenLoaded;
            scriptTag.src = scriptSrc;
            document.body.append(scriptTag);
        });
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
        
        // 20% stylesheets | 80% scripts
        let progressBar = new ProgressBar();
        progressBar.setProgress(0);
        
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
                progressBar.setProgress(++scriptsDone / (requiredScripts.length + 1) * 0.8 + 0.2);
                if(scriptsDone < requiredScripts.length) {
                    loadScript(requiredScripts[scriptsDone]).then(afterScriptLoaded);
                } else {
                    waitForYoutubeAPI(() => {
                        progressBar.setProgress(++scriptsDone / (requiredScripts.length + 1) * 0.8 + 0.2);
                        console.log("Loaded all scripts!");
                        
                        delete window.onYouTubeIframeAPIReady;
                        delete window.isYoutubeAPILoaded;
                        
                        progressBar.bar.ontransitionend = () => {
                            loadScreenBg.style.opacity = "0%";
                            progressBar.track.style.opacity = "0%";
                            setTimeout(() => {
                                progressBar.remove();
                                loadScreenBg.parentElement.removeChild(loadScreenBg);
                                document.body.requestPointerLock();
                            }, 1000);
                        }
                        
                        // main function defined in index.js
                        main();
                    });
                }
            };
            afterScriptLoaded();
        });
    }
    
    load();
    
})();