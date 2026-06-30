import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { addVocabulary } from "../services/vocabulary.service";
import Header from "../components/Header";

function AddWordPage() {
  const { user } = useAuth();

  const [english, setEnglish] = useState("");
  const [vietnamese, setVietnamese] = useState("");
  const [example, setExample] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async () => {
    if (!user) return;

    if (!english || !vietnamese) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const { error } = await addVocabulary(
      user.id,
      english,
      vietnamese,
      category,
      example,
    );

    if (error) {
      alert(error.message);
      return;
    }

    alert("Thêm từ thành công");

    setEnglish("");
    setVietnamese("");
    setCategory("");
    setExample("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <Header showBackButton={true} />
        <div className="mx-auto w-full max-w-md rounded-lg border bg-white p-6 shadow">
          <h1 className="mb-6 text-center text-2xl font-bold">Thêm từ mới</h1>

          <input
            type="text"
            placeholder="Từ tiếng Anh"
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            className="mb-4 w-full rounded border p-2"
          />

          <input
            type="text"
            placeholder="Nghĩa tiếng Việt"
            value={vietnamese}
            onChange={(e) => setVietnamese(e.target.value)}
            className="mb-4 w-full rounded border p-2"
          />

          <input
            type="text"
            placeholder="Chủ đề (Ví dụ: Food, Travel...)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mb-4 w-full rounded border p-2"
          />

          <textarea
            placeholder="Ví dụ (không bắt buộc)"
            value={example}
            onChange={(e) => setExample(e.target.value)}
            className="mb-4 w-full rounded border p-2"
            rows={4}
          />

          <button
            onClick={handleSubmit}
            className="w-full rounded bg-blue-500 p-2 text-white"
          >
            Lưu từ vựng
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddWordPage;
