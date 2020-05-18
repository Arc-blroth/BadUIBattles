"use strict";

// ----------------------------------------
//               Polyfills                  
// ---------------------------------------- 
function getScreenX() {
	return window.screenX || window.screenLeft || NaN;
}
function getScreenY() {
	return window.screenY || window.screenTop || NaN;
}
function isScreenXYSupported() {
	return !isNaN(getScreenX());
}

// Source and performance benchmarks: https://medium.com/coding-at-dawn/the-fastest-way-to-find-minimum-and-maximum-values-in-an-array-in-javascript-2511115f8621
function findMinMaxInArray(array) {
	let min = array[0];
	let max = array[0];
	let minIndex = 0;
	let maxIndex = 0;
	for(let i = 1; i < array.length; i++) {
		let val = array[i];
		if(min > val) {
			min = val;
			minIndex = i;
		}
		if(max < val) {
			max = val;
			maxIndex = i;
		}
	}
	return [min, max, minIndex, maxIndex];
}

// ----------------------------------------
//                Globals                  
// ---------------------------------------- 
var popup = false;
var passwordValid = false;
var drawBufferX = [];
var drawBufferY = [];
var drawTimer = 0;
const DRAW_DELAY = 60;
const PLOT_SIZE = 28;

// ----------------------------------------
//            Tensorflow Setup             
// ----------------------------------------
var model = null;
tf.loadLayersModel('/model.json')
	.then(obj => {
		model = obj;
		console.log("Model loaded!");
	}).catch(err => {
		console.log("Could not load model :(");
	});
function getLabelFromClass(clazz) {
	if(clazz <= 9) return clazz;
	else if(clazz <= 9 + 26) return String.fromCharCode(65 + (clazz - 10));
	else return String.fromCharCode(97 + (clazz - 10 - 26));
}

// ----------------------------------------
//             Event Handling              
// ---------------------------------------- 
setTimeout(() => $(".welcome-1").css("display", "none"),  3000);
setTimeout(() => $(".welcome-2").css("display", "none"),  6000);
setTimeout(() => $(".welcome-3").css("display", "none"),  9000);
setTimeout(() => $(".welcome-4").css("display", "block"), 9000);

let passcodeField = $("#passcode");
passcodeField.val(""); // To prevent the browser caching the value between reloads
passcodeField.on('focus', () => {
	if(!popup) {
		if(isScreenXYSupported()) {
			alert([
				"2FA is enabled on this server.",
				"To type the password, you must demostrate your godly powers.",
				"Shake the universe to draw each character."
			].join("\n"));
			$("#backspaceDisclaimer").css("display", "block");
		} else {
			alert([
				"It appears that your perception of reality (browser)",
				"does not support shaking the universe. Please find a",
				"browser that does to continue.",
				"\n\nIf this keeps coming up, make sure that your browser",
				"is not fullscreen or maximized and try dragging it around",
				"and then reloading."
			].join(" "));
		}
		popup = true;
	}
});
passcodeField.on('keydown', () => {
	return false;
});


let notMatPlotCanvas = $("#notMatPlot");
let notMatPlot = notMatPlotCanvas[0].getContext('2d');
notMatPlot.lineWidth = 3;
notMatPlot.strokeStyle = 'white';
notMatPlot.fillStyle = 'black';

function update() {
	let x = getScreenX();
	let y = getScreenY();
	if(popup && !passwordValid) {
		if(isScreenXYSupported()) {
			if(drawBufferX.length == 0 || (drawBufferX[drawBufferX.length - 1] !== x && drawBufferY[drawBufferY.length - 1] !== y)) { 
				drawTimer = 0;
				drawBufferX.push(x);
				drawBufferY.push(y);
				
				if(drawBufferX.length > 1) notMatPlotCanvas.css("display", "block");
				notMatPlot.fillRect(0, 0, PLOT_SIZE, PLOT_SIZE);
				notMatPlot.beginPath();
				
				// Determine the bounds of the canvas.
				let minMaxX = findMinMaxInArray(drawBufferX);
				let minMaxY = findMinMaxInArray(drawBufferY);
				// Make the smallest drawing area not 1x1.
				minMaxX[0] -= PLOT_SIZE;
				minMaxX[1] += PLOT_SIZE;
				minMaxY[0] -= PLOT_SIZE;
				minMaxY[1] += PLOT_SIZE;
				
				let factorX = (minMaxX[1] - minMaxX[0]) / PLOT_SIZE;
				let factorY = (minMaxY[1] - minMaxY[0]) / PLOT_SIZE;
				
				for(let i = 0; i < drawBufferX.length; i++) {
					let pixX = Math.round((drawBufferX[i] - minMaxX[0]) / factorX);
					let pixY = Math.round((drawBufferY[i] - minMaxY[0]) / factorY);
					if(i == 0) {
						notMatPlot.moveTo(pixX, pixY);
					} else {
						notMatPlot.lineTo(pixX, pixY);
					}
				}
				notMatPlot.stroke();
				
			} else {
				drawTimer++;
			}
		} else {
			drawTimer++;
		}
		if(drawTimer > DRAW_DELAY) {
			drawTimer = DRAW_DELAY;
			
			if(drawBufferX.length != 0) {
				// Prediction time
				if(drawBufferX.length > 1) {
					
					// The EMNIST dataset is inverted horizontally and rotated counterclockwise
					let origImgData = notMatPlot.getImageData(0, 0, PLOT_SIZE, PLOT_SIZE);
					let translatedImgData = notMatPlot.createImageData(origImgData);
					for(let pixY = 0; pixY < PLOT_SIZE; pixY++) {
						for(let pixX = 0; pixX < PLOT_SIZE; pixX++) {
							let translatedPixIndex = pixY * 4 * PLOT_SIZE + pixX * 4;
							let origPixIndex = pixX * 4 * PLOT_SIZE + pixY * 4;
							translatedImgData.data[translatedPixIndex] = origImgData.data[origPixIndex];
							translatedImgData.data[translatedPixIndex + 1] = origImgData.data[origPixIndex + 1];
							translatedImgData.data[translatedPixIndex + 2] = origImgData.data[origPixIndex + 2];
							translatedImgData.data[translatedPixIndex + 3] = origImgData.data[origPixIndex + 3];
						}
					}
					
					let unproccessedTensor = tf.split(tf.browser.fromPixels(translatedImgData), 3, 2)[0];
					let tensorBuffer = unproccessedTensor.bufferSync();
					
					for(let i = 0; i < PLOT_SIZE; i++) {
						for(let j = 0; j < PLOT_SIZE; j++) {
							tensorBuffer.set(tensorBuffer.get(i, j, 0) / 255, i, j, 0);
						}
					}
					
					let tensor = tensorBuffer.toTensor().expandDims(0);
					let prediction = model.predict(tensor).arraySync()[0];
					// console.log(prediction);
					let predictedClass = findMinMaxInArray(prediction)[3];
					let predictedLabel = getLabelFromClass(predictedClass);
					console.log("Prediction: " + predictedLabel);
					
					passcodeField.val(passcodeField.val() + predictedLabel);
					validate();
					notMatPlotCanvas.css("display", "none");
				}
				
				// See https://stackoverflow.com/questions/1232040/how-do-i-empty-an-array-in-javascript
				drawBufferX.length = 0;
				drawBufferY.length = 0;
			}
		}
	}
	if(passwordValid) {
		$(".welcome-4").css("display", "none" );
		$(".welcome-5").css("display", "block");
		setTimeout(() => window.location = "https://bulbapedia.bulbagarden.net/wiki/Hall_of_Origin",  3000);
		return;
	}
	requestAnimationFrame(update);
}

function validate() {
	let request = new XMLHttpRequest();
	request.open('POST', '/validate', true);
	
	request.onreadystatechange = function() {
		if (this.readyState === 4) {
			if (this.status >= 200 && this.status < 400) {
				if(this.responseText == "true") {
					passwordValid = true;
				}
			}
		}
	};
	
	request.setRequestHeader('Content-Type', 'text/plain; charset=UTF-8');
	request.send(passcodeField.val());
}

update();
notMatPlotCanvas.css("display", "none");