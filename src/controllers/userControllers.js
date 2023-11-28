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

module.exports = {
  getUsers,
  getUsersById,
};
