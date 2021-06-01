const express = require('express');
const cors = require('cors');
const { registerController, loginController } = require('./controllers/authController');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/register', registerController);
app.post('/login', loginController);

app.listen(5000, () => {
  console.log('server is up in port 5000');
});
