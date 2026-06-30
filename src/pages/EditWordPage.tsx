import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getVocabularyById,
  updateVocabulary,
} from "../services/vocabulary.service";

function EditWordPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [english, setEnglish] = useState("");
  const [vietnamese, setVietnamese] = useState("");
  const [example, setExample] = useState("");

  useEffect(() => {
    const fetchVocabulary = async () => {
      if (!id) return;

      const { data, error } = await getVocabularyById(id);

      if (error) {
        console.error(error);
        return;
      }

      setEnglish(data.english);
      setVietnamese(data.vietnamese);
      setExample(data.example || "");
    };

    fetchVocabulary();
  }, [id]);

  const handleUpdate = async () => {
    if (!id) return;

    const { error } = await updateVocabulary(id, english, vietnamese, example);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Cập nhật thành công");

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="mb-6 text-center text-2xl font-bold">Sửa từ vựng</h1>

        <input
          type="text"
          value={english}
          onChange={(e) => setEnglish(e.target.value)}
          className="mb-4 w-full rounded border p-2"
        />

        <input
          type="text"
          value={vietnamese}
          onChange={(e) => setVietnamese(e.target.value)}
          className="mb-4 w-full rounded border p-2"
        />

        <textarea
          value={example}
          onChange={(e) => setExample(e.target.value)}
          className="w-full rounded border p-2"
          rows={4}
        />

        <button
          onClick={handleUpdate}
          className="mt-4 w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
}

export default EditWordPage;
