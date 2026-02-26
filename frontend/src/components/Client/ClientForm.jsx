import { useState, useEffect } from "react";
import Input from "../UI/Input";
import Button from "../UI/Button";

const EMPTY = { name: "", email: "", phone: "", company: "" };

export default function ClientForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(initialData ? { ...EMPTY, ...initialData } : EMPTY);
    setErrors({});
  }, [initialData]);

  function validate() {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = "Minimo 2 caracteres";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email invalido";
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }
    onSubmit(form);
    if (!initialData) setForm(EMPTY);
    setErrors({});
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  const isEditing = !!initialData;

  return (
    <form onSubmit={handleSubmit} className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-900 uppercase tracking-wide">
          {isEditing ? "Editar Cliente" : "Nuevo Cliente"}
        </h2>
        {isEditing && (
          <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
            Editando
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombre *"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors.name}
          placeholder="Nombre completo"
        />
        <Input
          label="Email *"
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
          placeholder="correo@ejemplo.com"
        />
        <Input
          label="Telefono"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="+52 55 1234 5678"
        />
        <Input
          label="Empresa"
          value={form.company}
          onChange={(e) => handleChange("company", e.target.value)}
          placeholder="Nombre de empresa"
        />
      </div>

      <div className="flex gap-3 mt-6">
        <Button type="submit">
          {isEditing ? "Actualizar Cliente" : "Crear Cliente"}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
