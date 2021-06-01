const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('email-validator');
const pool = require('../db');
const config = require('../config/auth.config');

exports.registerController = async (req, res) => {
  const { uuid, password, email } = req.body;
  if (!uuid || !password || !email) {
    return res.status(400).send({
      msg: 'uuid, email and password are required',
    });
  }
  if (!validator.validate(email)) {
    return res.status(400).send({
      msg: 'Please provide a valid email',
    });
  }
  const hashedPassword = bcrypt.hashSync(password, 8);
  try {
    await pool.query('INSERT INTO myuser(user_uuid, email, password) values($1, $2, $3);', [uuid, email, hashedPassword]);
    return res.send({
      msg: 'User was registered successfully!',
    });
  } catch (e) {
    return res.status(400).send({
      msg: e.detail,
    });
  }
};

exports.loginController = async (req, res) => {
  const { email, password } = req.body;
  if (!password || !email) {
    res.status(400).send({
      msg: 'email and password are required',
    });
  }
  if (!validator.validate(email)) {
    res.status(400).send({
      msg: 'Please provide a valid email',
    });
  }
  try {
    const { rows } = await pool.query('SELECT * FROM myuser WHERE email = $1', [email]);
    if (rows.length > 0) {
      const user = rows[0];
      const passwordIsValid = bcrypt.compareSync(
        password,
        user.password,
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          msg: 'Invalid Password!',
        });
      }
      const token = jwt.sign({ id: user.user_uuid }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      return res.status(200).send({
        uuid: user.user_uuid,
        email: user.email,
        accessToken: token,
      });
    }
    return res.status(404).send({ msg: 'User Not found.' });
  } catch (e) {
    return res.status(400).send({
      msg: e,
    });
  }
};
