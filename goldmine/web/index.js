"use strict";

// ----------------------------------------
//          Imports and Polyfills                  
// ----------------------------------------

// From https://github.com/bryc/code/blob/master/jshash/PRNGs.md
function mulberry32(a) {
    return function() {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

// ----------------------------------------
//                Globals                  
// ---------------------------------------- 
const usernameRegex = /[a-xB-Z{420}{69}]+/m;
const rockGoldBlockId = 18; // Because apparently classic needs a registry system
let hasUserCompletedCaptcha = false;
let rockGoldMined = 0;
// ----------------------------------------
//             Event Handling              
// ---------------------------------------- 
let seed = Math.floor(Date.now() / 8.64e+7);
let prng = mulberry32(seed);
for(let i = 0; i < 6; i++) {
	let nums = new Uint8Array(prng() * 12 + 16);
	for(let j = 0; j < nums.length; j++) {
		nums[j] = Math.round(prng() * 255);
	}
	let val = base2048.encode(nums);
	document.getElementById("passwordIn").options[i] = new Option(val, val);
}

let usernameIn = document.getElementById("usernameIn");
let usernameInfoBlock = document.getElementById("usernameInfoBlock");
let usernameConfIn = document.getElementById("usernameConfIn");
let usernameConfInfoBlock = document.getElementById("usernameConfInfoBlock");

usernameIn.oninput = (e) => {
    let match = usernameIn.value.match(usernameRegex);
	if(match === null || match[0].length != usernameIn.value.length) {
        usernameIn.classList.add("passive-agressive-error");
        usernameInfoBlock.classList.add("passive-agressive-error");
    } else {
        usernameIn.classList.remove("passive-agressive-error");
        usernameInfoBlock.classList.remove("passive-agressive-error");
    }
};
usernameConfIn.oninput = (e) => {
	if(usernameIn.value != usernameConfIn.value) {
        usernameConfIn.classList.add("passive-agressive-error");
        usernameConfInfoBlock.classList.add("passive-agressive-error");
    } else {
        usernameConfIn.classList.remove("passive-agressive-error");
        usernameConfInfoBlock.classList.remove("passive-agressive-error");
    }
};

document.getElementById("notBotCheck").onchange = (e) => {
	document.getElementById("notBotCheck").checked = hasUserCompletedCaptcha;
	if(!hasUserCompletedCaptcha) {
		startCaptcha();
	}
};

function startCaptcha() {
	$("#captchaModal").modal();
}

// ----------------------------------------
//        Is this a Minecraft Mod?              
// ---------------------------------------- 
window.addEventListener("message", msg => {
    if(msg.isTrusted && msg.data.hasOwnProperty("minedBlock")) {
        console.log(msg.data.minedBlock);
        if(msg.data.minedBlock == rockGoldBlockId) {
            rockGoldMined++;
            document.getElementById("goldOreLeft").innerHTML = `To continue, please mine at least ${8 - rockGoldMined} more gold ore.`;
            if(rockGoldMined >= 8) {
                $("#captchaModal").modal("hide");
                document.getElementById("notBotCheck").checked = true;
                document.getElementById("submit").disabled = false;
                hasUserCompletedCaptcha = true;
                let mcFrame = document.getElementById("mc-really-old-edition");
                let mcContent = mcFrame.contentDocument || mcFrame.contentWindow.document;
                mcContent.exitPointerLock();
            }
        }
    }
}, false);


