"use strict";
"actually wait no use strictn't";

import * as THREE from "./three.module.js";
import {GLTFLoader} from "./GLTFLoader.js";

// ----------------------------------------
//                Globals                  
// ---------------------------------------- 
var usernamePopupTriggered = false;
var cannonAngle = 0;
var timesCannonFired = 0;
var selectedCharacter = "A";
var loadedCharacter = null;

// ----------------------------------------
//            Three.js Setup               
// ---------------------------------------- 
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x99D9F3);
var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
var cameraAngle = 190 / 180 * Math.PI;

// load the cannon model
const xAxis = new THREE.Vector3(1, 0, 0);
var renderer = new THREE.WebGLRenderer();
var modelLoader = new GLTFLoader();
var cannon = null;
modelLoader.load("cannon.glb", function (gltf) {
	cannon = gltf.scene;
	scene.add(cannon);
}, undefined, function (err) {
	console.error(err);
});

// lighting is a thing
scene.add(new THREE.AmbientLight(0xD0D0D0, 3));
var light = new THREE.DirectionalLight(0xA0A0A0, 5);
light.position.set(0, 10, 0);
light.target.position.set(0, 2, 10);
scene.add(light);
scene.add(light.target);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;

// Add the canvas
renderer.domElement.className = "cannon";
renderer.domElement.style.display = "none";
document.body.appendChild(renderer.domElement);

function adjustCamera(zoom) {
	camera.position.x = zoom * Math.cos(cameraAngle);
	camera.position.y = zoom / 2 - 0.5;
	camera.position.z = zoom * Math.sin(cameraAngle);
	camera.lookAt(new THREE.Vector3(0, zoom / 2 - 0.5, 0));
	camera.position.z += 1;
}

function adjustCannon(angle) {
	cannon.setRotationFromAxisAngle(xAxis, angle);
}

function renderCannon() {
	requestAnimationFrame(renderCannon);
	renderer.setSize(0.5 * window.innerWidth, 0.5 * window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	adjustCamera(1000 / Math.min(window.innerWidth, window.innerHeight) * 10);
	adjustCannon(cannonAngle);
	camera.updateProjectionMatrix();
	renderer.render(scene, camera);
}

// ----------------------------------------
//     BadUI Activation Event Handling     
// ---------------------------------------- 
const popupTrigger = () => {
	if(!usernamePopupTriggered) {
		alert([
			"As a new precaution to the unprecedented co-rona virus",
			"we're doing our part to keep you safe! All characters entered",
			"into the LOGin fields must now be safely done from six feet apart."
		].join(" "));
		$("#jumbotron").css("transform", "rotateY(-60deg) translate(150%, 0px) skewY(25deg)");
		$("#jumbotron").addClass("px-5");
		$("#jumbotron").addClass("py-5");
		renderer.domElement.style.display = "block";
		$("#fireNotice").css("display", "block");
		$("#characterSelectBox").css("display", "block");
		$("#submit").prop("disabled", false);
		usernamePopupTriggered = true;
		renderCannon();
	}
};
$("#usernameIn").click(popupTrigger);
$("#passwordIn").click(popupTrigger);

$(document).on("mousemove", (e) => {
	cannonAngle = (Math.PI / 4) * e.pageY / window.innerHeight - (Math.PI / 6);
});

function spawnFire() {
	timesCannonFired++;
	if(timesCannonFired > 1) {
		for(let fire = 0; fire < Math.max(Math.min(Math.random() * timesCannonFired, 4), 1); fire++) {
			let top = Math.random() * 100;
			let left = Math.random() * 100;
			var img = document.createElement('div');
			img.style = `top: ${top}%; left: ${left}%;`;
			img.className = "burnCursor";
			document.body.appendChild(img);
		}
	}
}

function bindTextCannonTarget(id) {
	$(id).on("mouseenter", () => {
		if(usernamePopupTriggered) {
			$(id).focus();
		}
	});

	$(id).on("mouseleave", () => {
		if(usernamePopupTriggered) {
			$(id).blur();
		}
	});
	$(id).on("keypress", (e) => {
		if(usernamePopupTriggered) {
			if(e.key === " ") {
				if(loadedCharacter != null) {
					let tempCharacter = loadedCharacter;
					loadedCharacter = null;
					$("#shaker").css("animation-play-state", "running");
					setTimeout(() => {
						$(id).val($(id).val() + tempCharacter);
						$("#characterLoadLabel").css("display", "none");
						$("#characterLoad").prop("disabled", false);
						$("#shaker").css("animation-play-state", "paused"); 
						spawnFire();
					}, 375);
				}
			}
		}
		return false;
	});
}
bindTextCannonTarget("#usernameIn");
bindTextCannonTarget("#passwordIn");

$("#notBotCheckDiv").on("mouseenter", () => {
	if(usernamePopupTriggered) {
		$("#notBotCheck").addClass("notBotCheckChecked");
		$("#notBotCheckDiv").focus();
	}
});
$("#notBotCheckDiv").on("mouseleave", () => {
	if(usernamePopupTriggered) {
		$("#notBotCheck").removeClass("notBotCheckChecked");
		$("#notBotCheckDiv").blur();
	}
});
$("#notBotCheckDiv").on("keypress", (e) => {
	if(usernamePopupTriggered) {
		if(e.key === " ") {
			$("#shaker").css("animation-play-state", "running");
			setTimeout(() => {
				$("#shaker").css("animation-play-state", "paused"); 
				$("#notBotCheck").prop("checked", !$("#notBotCheck").prop("checked"));
				spawnFire();
			}, 375);
		}
	}
});

$("#characterUnicodeCheck").on("input", () => {
	if($("#characterUnicodeCheck").prop("checked")) {
		$("#characterSlider").prop("max", 917999);
		$("#characterSlider").css("width", "100%");
	} else {
		$("#characterSlider").prop("max", 127);
		$("#characterSlider").css("width", "30%");
	}
});

$("#characterLoad").on("click", () => {
	console.log(loadedCharacter);
	if(loadedCharacter === null) {
		loadedCharacter = selectedCharacter;
		$("#characterLoadLabel").css("display", "inline-block");
		$("#characterLoad").prop("disabled", true);
	}
	return false;
});

$("#characterSlider").on("input", () => {
	loadedCharacter = String.fromCharCode($("#characterSlider").val());
	$("#characterOut").text(loadedCharacter);
});

$("#submit").on("click", () => {
	alert([
		"ERROR",
		"Could not validate username",
		"TCP Handshaking was canceled due to co-rona restrictions.",
		"",
		"Please try again later."
	].join("\n"));
	return false;
});
