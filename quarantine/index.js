const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.static("web"));

app.get('/', (req, res) => res.sendFile(__dirname + "/web/index.html"));

app.listen(port, () => console.log(`BadUI serving things at http://localhost:${port}`));