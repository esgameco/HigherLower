const express = require('express');

const app = express();
const port = 5000;

app.use(express.static('../frontend'));

app.listen(port);