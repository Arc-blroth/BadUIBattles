const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.static("web"));
app.use(bodyParser.json());
app.get('/', (req, res) => res.sendFile(__dirname + "/web/index.html"));

app.listen(port, () => console.log(`The battle begins at http://localhost:${port}`));