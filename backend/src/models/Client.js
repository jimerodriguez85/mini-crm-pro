const { v4: uuidv4 } = require("uuid");

class Client {
  constructor({ name, email, phone = "", company = "", status = "activo" }) {
    this.id = uuidv4();
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.company = company;
    this.status = status;
    this.createdAt = new Date().toISOString();
  }

  static validate(data) {
    const errors = [];
    if (!data.name || data.name.trim().length < 2) {
      errors.push("El nombre es obligatorio (mínimo 2 caracteres)");
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push("Email inválido");
    }
    return errors;
  }
}

module.exports = Client;
