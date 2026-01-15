import request from "supertest";
import { App } from "../../../src/app";

describe("Credit Line API Integration Tests", () => {
  let app: App;

  beforeAll(() => {
    app = new App(3001);
  });

  describe("POST /api/credit-lines", () => {
    it("should create a new credit line", async () => {
      const creditLineData = {
        banqueId: "123e4567-e89b-12d3-a456-426614174000",
        montantPlafond: 1000000,
        devise: "DZD",
        dateDebut: "2024-01-01T00:00:00Z",
        dateFin: "2025-12-31T23:59:59Z",
        typeFinancement: "LC",
        garanties: [
          {
            type: "HYPOTHEQUE",
            montant: 500000,
            dateExpiration: "2025-12-31T00:00:00Z",
            description: "Hypothèque sur bien immobilier",
          },
        ],
      };

      const response = await request(app.getApp())
        .post("/api/credit-lines")
        .send(creditLineData)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.message).toBe("Credit line created successfully");
    });

    it("should return 400 for invalid data", async () => {
      const invalidData = {
        banqueId: "invalid-id",
        montantPlafond: -1000,
        devise: "INVALID",
      };

      const response = await request(app.getApp())
        .post("/api/credit-lines")
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /api/credit-lines", () => {
    it("should list all credit lines", async () => {
      const response = await request(app.getApp())
        .get("/api/credit-lines")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
