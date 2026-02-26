import { useRef, useState } from "react";
import { uploadFile } from "../../services/fileService";
import { useNotification } from "../../context/NotificationContext";
import Button from "../UI/Button";

export default function FileUpload({ clientId, onUploaded }) {
  const inputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const { notify } = useNotification();

  async function handleChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      await uploadFile(clientId, file);
      notify("Archivo subido");
      onUploaded?.();
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setUploading(false);
      inputRef.current.value = "";
    }
  }

  return (
    <div className="card p-4 flex items-center gap-4">
      <input
        ref={inputRef}
        type="file"
        onChange={handleChange}
        className="hidden"
      />
      <Button onClick={() => inputRef.current.click()} disabled={uploading}>
        {uploading ? "Subiendo..." : "Subir Archivo"}
      </Button>
      <p className="text-xs text-gray-400">Max 10MB</p>
    </div>
  );
}
