import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  getVocabularies,
  deleteVocabulary,
  getStatistics,
} from "../services/vocabulary.service";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";

function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [vocabularies, setVocabularies] = useState<any[]>([]);
  const [statistics, setStatistics] = useState({
    totalWords: 0,
    reviewTodayCount: 0,
    rememberedCount: 0,
  });

  useEffect(() => {
    const fetchVocabularies = async () => {
      if (!user) return;

      const { data, error } = await getVocabularies(user.id);

      if (error) {
        console.error(error);
        return;
      }

      setVocabularies(data || []);

      const stats = await getStatistics(user.id);

      if (!stats.error) {
        setStatistics({
          totalWords: stats.totalWords,
          reviewTodayCount: stats.reviewTodayCount,
          rememberedCount: stats.rememberedCount,
        });
      }
    };

    fetchVocabularies();
  }, [user]);

  const handleDelete = async (id: string) => {
    const isConfirm = window.confirm("Bạn có chắc chắn muốn xóa từ này không?");

    if (!isConfirm) return;

    const { error } = await deleteVocabulary(id);

    if (error) {
      alert(error.message);
      return;
    }

    setVocabularies((prev) => prev.filter((vocab) => vocab.id !== id));
  };

  const sortedVocabularies = [...vocabularies].sort((a, b) =>
    a.english.localeCompare(b.english),
  );

  const categories = [
    "all",
    ...new Set(vocabularies.map((vocab) => vocab.category).filter(Boolean)),
  ];

  const filteredVocabularies = sortedVocabularies
    .filter((vocab) => {
      if (filter === "review") {
        return vocab.repetition < 5;
      }

      if (filter === "mastered") {
        return vocab.repetition >= 5;
      }

      return true;
    })
    .filter((vocab) => {
      if (selectedCategory === "all") return true;

      return vocab.category === selectedCategory;
    })
    .filter(
      (vocab) =>
        vocab.english.toLowerCase().includes(search.toLowerCase()) ||
        vocab.vietnamese.toLowerCase().includes(search.toLowerCase()),
    );

  // Hàm tính toán số ngày còn lại để ôn tập từ vựng
  const getReviewText = (date: string | null) => {
    if (!date) return "-";

    const reviewDate = new Date(date);
    const today = new Date();

    reviewDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = reviewDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "Hôm nay";
    if (diffDays === 1) return "Ngày mai";

    return `Còn ${diffDays} ngày`;
  };

  const getLevel = (repetition: number) => {
    if (repetition >= 5)
      return {
        text: "🟢 Đã nhớ",
        color: "text-green-600",
      };

    if (repetition >= 2)
      return {
        text: "🟡 Đang học",
        color: "text-yellow-600",
      };

    return {
      text: "🔴 Mới học",
      color: "text-red-600",
    };
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <Header showBackButton={false} />

        <div className="grid gap-6 md:grid-cols-3">
          <Link
            to="/study"
            className="bg-white rounded-xl shadow p-6 text-center hover:shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-2">🎯 Học hôm nay</h2>
            <p>Ôn tập các từ đến hạn.</p>
          </Link>

          <Link
            to="/add-word"
            className="bg-white rounded-xl shadow p-6 text-center hover:shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-2">➕ Thêm từ mới</h2>
            <p>Thêm từ vựng mới vào hệ thống.</p>
          </Link>

          <Link
            to="/statistics"
            className="bg-white rounded-xl shadow p-6 text-center hover:shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-2">📈 Thống kê</h2>
            <p>Xem tiến độ học tập.</p>
          </Link>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <div className="bg-white rounded-xl shadow">
            <h2 className="mb-8 text-2xl font-semibold text-center">
              Danh sách từ vựng
            </h2>

            <div className="mb-6 grid gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="🔍 Tìm kiếm từ vựng..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border p-3"
              />

              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-xl border p-3 pr-12 appearance-none"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all"
                        ? "📚 Tất cả chủ đề"
                        : `📂 ${category}`}
                    </option>
                  ))}
                </select>

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                  ▼
                </span>
              </div>
            </div>

            <div className="mb-6 flex gap-3">
              <button
                onClick={() => setFilter("all")}
                className={`rounded px-4 py-2 ${
                  filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                Tất cả
              </button>

              <button
                onClick={() => setFilter("review")}
                className={`rounded px-4 py-2 ${
                  filter === "review" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                Cần ôn
              </button>

              <button
                onClick={() => setFilter("mastered")}
                className={`rounded px-4 py-2 ${
                  filter === "mastered"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                Đã nhớ
              </button>
            </div>

            {filteredVocabularies.length === 0 ? (
              <p>Bạn chưa có từ vựng nào.</p>
            ) : (
              <div className="space-y-3">
                {filteredVocabularies.map((vocab) => (
                  <div
                    key={vocab.id}
                    className="flex items-center justify-between rounded border p-4"
                  >
                    <div>
                      <h3 className="text-2xl font-bold">{vocab.english}</h3>

                      <p className="mt-1 text-lg text-gray-600">
                        {vocab.vietnamese}
                      </p>

                      {vocab.example && (
                        <p className="mt-2 text-sm italic text-gray-500">
                          Ví dụ: {vocab.example}
                        </p>
                      )}

                      <div className="mt-3 flex gap-4 text-sm">
                        {vocab.category && (
                          <p className="mt-2 text-sm text-purple-500">
                            🏷️ {vocab.category}
                          </p>
                        )}

                        <p
                          className={`mt-2 text-sm font-semibold ${
                            getLevel(vocab.repetition).color
                          }`}
                        >
                          {getLevel(vocab.repetition).text}
                        </p>

                        <p className="mt-2 text-sm font-medium text-blue-600">
                          🔁 Ôn lại: {getReviewText(vocab.next_review_day)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/edit-word/${vocab.id}`)}
                        className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                      >
                        Sửa
                      </button>

                      <button
                        onClick={() => handleDelete(vocab.id)}
                        className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-blue-100 p-6 text-center">
              <h3 className="text-lg font-semibold">Tổng số từ</h3>
              <p className="mt-2 text-4xl font-bold">{statistics.totalWords}</p>
            </div>

            <div className="rounded-xl bg-yellow-100 p-6 text-center">
              <h3 className="text-lg font-semibold">Cần ôn hôm nay</h3>
              <p className="mt-2 text-4xl font-bold">
                {statistics.reviewTodayCount}
              </p>
            </div>

            <div className="rounded-xl bg-green-100 p-6 text-center">
              <h3 className="text-lg font-semibold">Đã nhớ</h3>
              <p className="mt-2 text-4xl font-bold">
                {statistics.rememberedCount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
