const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fetch = require('node-fetch');
const port = process.env.PORT || 8080;

// Using AcornJS would have been better, but our "mod"
// isn't really big enough to warrent that.
//
// @Inject(target = "setBlock", at = @At("HEAD"), deobf = false)
function notSpongepoweredMixin(source) {
    let originalIndex = source.indexOf(".prototype.setBlock=");
    let injectionIndex = originalIndex;
    while(source.charAt(injectionIndex) != "{") {
        injectionIndex++;
    }
    injectionIndex++;
    return source.slice(0, injectionIndex) + `
        window.parent.postMessage( {"minedBlock": t.length ? this.world.getBlockID(t[0], t[1], t[2]) : this.world.getBlockID(t, i, n)}, "*" );
    ` + source.slice(injectionIndex);
}

app.use(express.static("web"));
app.use(express.static("model"));
app.use(bodyParser.text());

app.get('/minecraft-cors-defeater', function (req, res) {
    fetch("https://classic.minecraft.net/", {
        method: 'get',
        headers: { 'User-Agent': req.headers['User-Agent'] },
    })
    .then(data => data.text())
    .then(data => res.send(data))
    .catch(err => res.send(err));
});
app.get('/assets/js/app.js*+', function (req, res) {
    fetch("https://classic.minecraft.net" + req.path, {
        method: 'get',
        headers: { 'User-Agent': req.headers['User-Agent'] },
    })
    .then(data => data.text())
    .then(data => {
        res.type("application/javascript");
        res.send(notSpongepoweredMixin(data));
    })
    .catch(err => res.send(err));
});
app.get('/assets/css/*+', function (req, res) {
    fetch("https://classic.minecraft.net" + req.path, {
        method: 'get',
        headers: { 'User-Agent': req.headers['User-Agent'] },
    })
    .then(data => data.text())
    .then(data => {
        res.type("text/css");
        res.send(data);
    })
    .catch(err => res.send(err));
});
app.get('/assets*+', function (req, res) {
    fetch("https://classic.minecraft.net" + req.path, {
        method: 'get',
        headers: { 'User-Agent': req.headers['User-Agent'] },
    })
    .then(data => data.buffer())
    .then(data => {
        res.contentType(req.path);
        res.send(data);
    })
    .catch(err => res.send(err));
});
app.post('/', (req, res) => res.sendFile(__dirname + "/web/index.html"));
app.get('/', (req, res) => res.sendFile(__dirname + "/web/index.html"));

app.listen(port, () => console.log(`Gold mine setup at http://localhost:${port}`));