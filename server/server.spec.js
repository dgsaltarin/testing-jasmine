const express = require("express");
const logger = require("morgan");
const PinsRouter = require("./routes/pins");
const http = require("http");
const Pins = require("./models/Pins");
const request = require("request");
const axios = require("axios");
var requestPromise = require("request-promise-native");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use("/api", PinsRouter.router);
app.set("port", 3000);

describe("Testing de router", () => {
  let server;

  beforeAll(() => {
    server = http.createServer(app);
    server.listen(3000);
  });

  afterAll(() => {
    server.close();
  });

  //GET 200
  describe("GET", () => {
    it("200 and find pin", (done) => {
      const data = [{ id: 1 }];
      spyOn(Pins, "find").and.callFake((callBack) => {
        callBack(false, data);
      });

      request.get("http://localhost:3000/api", (error, response, body) => {
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toEqual([{ id: 1 }]);
        done();
      });
    });
  });

  //GET 500
  describe("GET", () => {
    it("500 server error", (done) => {
      const data = [{ id: 1 }];
      spyOn(Pins, "find").and.callFake((callBack) => {
        callBack(true, data);
      });

      request.get("http://localhost:3000/api", (error, response, body) => {
        expect(response.statusCode).toBe(500);
        done();
      });
    });
  });

  //GET BY ID 200
  describe("GET BY ID", () => {
    it("200, GET BY ID", (done) => {
      const data = { id: 1 };
      const id = 1;
      spyOn(Pins, "findById").and.callFake((id, callBack) => {
        callBack(false, data);
      });

      request.get(
        `http://localhost:3000/api/${id}}`,
        (error, response, body) => {
          expect(JSON.parse(body)).toEqual({ id: 1 });
          expect(response.statusCode).toBe(200);
          done();
        }
      );
    });
  });

  //500 GET BY ID
  describe("500 GET BY ID", () => {
    it("500, GET BY ID", (done) => {
      const data = { id: 1 };
      const id = 1;
      spyOn(Pins, "findById").and.callFake((id, callBack) => {
        callBack(true, data);
      });

      request.get(
        `http://localhost:3000/api/${id}}`,
        (error, response, body) => {
          expect(response.statusCode).toBe(500);
          done();
        }
      );
    });
  });

  //POST 200
  describe("POST", () => {
    it("200", (done) => {
      const post = [
        {
          title: "Platzi",
          author: "PLazi",
          description: "nuna pares de aprender",
          percentage: 0,
          tags: [],
          assets: [],
        },
      ];
      spyOn(Pins, "create").and.callFake((pin, callBack) => {
        callBack(false, {});
      });
      spyOn(requestPromise, "get").and.returnValue(
        Promise.resolve(
          '<title>Platzi</title><meta name="description">nunca pares de aprender</meta>'
        )
      );

      const assets = [{ url: "http://platzi.com" }];

      axios
        .post("http://localhost:3000/api", {
          title: "title",
          author: "author",
          description: "description",
          assets,
        })
        .then((res) => {
          expect(res.status).toBe(200);
          done();
        });
    });
  });

  //POST PDF
  describe("POST", () => {
    it("200 PDF", (done) => {
      spyOn(Pins, "create").and.callFake((pin, callBack) => {
        callBack(false, {});
      });

      const assets = [{ url: "http://platzi.pdf" }];

      axios
        .post("http://localhost:3000/api", {
          title: "title",
          author: "author",
          description: "description",
          assets,
        })
        .then((res) => {
          expect(res.status).toBe(200);
          done();
        });
    });
  });
});
