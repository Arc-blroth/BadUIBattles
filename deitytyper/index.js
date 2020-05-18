const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.static("web"));
app.use(express.static("model"));
app.use(bodyParser.text());

app.get('/', (req, res) => res.sendFile(__dirname + "/web/index.html"));
app.post('/validate', (req, res) => res.send(req.body == "AZUREFLUTE" ? "true" : "false"));

app.listen(port, () => console.log(`BadUI serving things at http://localhost:${port}`));