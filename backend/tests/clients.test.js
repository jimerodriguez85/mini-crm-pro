const { describe, it } = require("node:test");
const assert = require("node:assert");
const Client = require("../src/models/Client");

describe("Client model", () => {
  it("crea un cliente con id y fecha", () => {
    const c = new Client({ name: "Test", email: "test@test.com" });
    assert.ok(c.id);
    assert.ok(c.createdAt);
    assert.strictEqual(c.status, "activo");
  });

  it("valida nombre requerido", () => {
    const errors = Client.validate({ name: "", email: "a@b.com" });
    assert.ok(errors.length > 0);
  });

  it("valida email formato", () => {
    const errors = Client.validate({ name: "Test", email: "no-email" });
    assert.ok(errors.length > 0);
  });

  it("pasa validación con datos correctos", () => {
    const errors = Client.validate({ name: "Ana", email: "ana@test.com" });
    assert.strictEqual(errors.length, 0);
  });
});
