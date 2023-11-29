const request = require("supertest");
const database = require("../database");
const crypto = require("node:crypto");
afterAll(() => database.end());
const app = require("../src/app");

describe("GET /api/users", () => {
  it("should return all users", async () => {
    const response = await request(app).get("/api/users");
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
  });
});

describe("GET /api/users/:id", () => {
  it("should return one user", async () => {
    const response = await request(app).get("/api/users/1");
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
  });

  it("should return no user", async () => {
    const response = await request(app).get("/api/users/0");
    expect(response.status).toEqual(404);
  });

  describe("POST /api/users", () => {
    it("should return created user", async () => {
      const newUser = {
        firstname: "Marie",
        lastname: "Martin",
        email: `${crypto.randomUUID()}@wild.co`,
        city: "Paris",
        language: "French",
      };

      const response = await request(app).post("/api/users").send(newUser);
      expect(response.status).toEqual(201);
      expect(response.body).toHaveProperty("id");
      expect(typeof response.body.id).toBe("number");

      const [result] = await database.query(
        "SELECT * FROM users WHERE id=?",
        response.body.id
      );

      const [userInDatabase] = result;

      expect(userInDatabase).toHaveProperty("id");

      expect(userInDatabase).toHaveProperty("firstname");
      expect(userInDatabase.firstname).toStrictEqual(newUser.firstname);

      expect(userInDatabase).toHaveProperty("lastname");
      expect(userInDatabase.lastname).toStrictEqual(newUser.lastname);

      expect(userInDatabase).toHaveProperty("email");
      expect(userInDatabase.email).toStrictEqual(newUser.email);

      expect(userInDatabase).toHaveProperty("city");
      expect(userInDatabase.city).toStrictEqual(newUser.city);

      expect(userInDatabase).toHaveProperty("language");
      expect(userInDatabase.language).toStrictEqual(newUser.language);
    });

    it("should return an error", async () => {
      const userWithMissingProps = { firstname: "Harry" };
      const response = await request(app)
        .post("/api/users")
        .send(userWithMissingProps);
      expect(response.status).toEqual(422);
    });
  });
});

describe("PUT /api/users/:id", () => {
  it("should edit user", async () => {
    const newUser = {
      firstname: "ole",
      lastname: "ola",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Angers",
      language: "French",
    };

    const [result] = await database.query(
      "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [
        newUser.firstname,
        newUser.lastname,
        newUser.email,
        newUser.city,
        newUser.language,
      ]
    );

    const id = result.insertId;

    const updatedUser = {
      firstname: "ola",
      lastname: "ole",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Angers",
      language: "French",
    };

    const response = await request(app)
      .put(`/api/users/${id}`)
      .send(updatedUser);

    expect(response.status).toEqual(204);

    const [users] = await database.query("SELECT * FROM users WHERE id=?", id);

    const [UserInDatabase] = users;

    expect(UserInDatabase).toHaveProperty("id");

    expect(UserInDatabase).toHaveProperty("firstname");
    expect(UserInDatabase.firstname).toStrictEqual(updatedUser.firstname);

    expect(UserInDatabase).toHaveProperty("lastname");
    expect(UserInDatabase.lastname).toStrictEqual(updatedUser.lastname);

    expect(UserInDatabase).toHaveProperty("email");
    expect(UserInDatabase.email).toStrictEqual(updatedUser.email);

    expect(UserInDatabase).toHaveProperty("city");
    expect(UserInDatabase.city).toStrictEqual(updatedUser.city);

    expect(UserInDatabase).toHaveProperty("language");
    expect(UserInDatabase.language).toStrictEqual(updatedUser.language);
  });
  it("should return an error", async () => {
    const userWithMissingProps = { firstname: "Peppa" };

    const response = await request(app)
      .put(`/api/users/1`)
      .send(userWithMissingProps);

    expect(response.status).toEqual(422);
  });

  it("should return no user", async () => {
    const newUser = {
      firstname: "Melanie",
      lastname: "Dedigama",
      email: "${crypto.randomUUID()}@wild.co",
      city: "Los Angeles",
      language: "American",
    };

    const response = await request(app).put("/api/users/0").send(newUser);

    expect(response.status).toEqual(404);
  });
});
