const database = require("../../database");

const users = [
  ("John", "Doe", "john.doe@example.com", "Paris", "English"),
  ("Valeriy", "Appius", "valeriy.appius@example.com", "Moscow", "Russian"),
  ("Ralf", "Geronimo", "ralf.geronimo@example.com", "New York", "Italian"),
  ("Maria", "Iskandar", "maria.iskandar@example.com", "New York", "German"),
  ("Jane", "Doe", "jane.doe@example.com", "London", "English"),
  ("Johanna", "Martino", "johanna.martino@example.com", "Milan", "Spanish"),
];

const getUsers = (req, res) => {
  database
    .query("SELECT * FROM users")
    .then(([user]) => {
      console.log(user);
      res.json(user);
    })
    .catch((err) => {
      console.error(500);
      res.status(500).send("Internal Server Error");
    });
};

const getUsersById = (req, res) => {
  const id = parseInt(req.params.id);
  database
    .query("select * from users where id = ?", [id])
    .then(([user]) => {
      if (user[0] != null) {
        res.json(user[0]);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const postUser = (req, res) => {
  const { firstname, lastname, email, city, language } = req.body;

  database
    .query(
      "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [firstname, lastname, email, city, language]
    )
    .then(([result]) => {
      res.status(201).send({ id: result.insertId });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const { firstname, lastname, email, city, language } = req.body;

  database
    .query(
      "update users set firstname = ?, lastname = ?, email = ?, city = ?, language = ? where id = ?",
      [firstname, lastname, email, city, language, id]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

module.exports = {
  getUsers,
  getUsersById,
  postUser,
  updateUser,
};
