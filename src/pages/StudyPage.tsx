import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  getTodayVocabularies,
  updateVocabularyReview,
} from "../services/vocabulary.service";
import Header from "../components/Header";

function StudyPage() {
  const { user } = useAuth();

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [vocabularies, setVocabularies] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [quizResult, setQuizResult] = useState("");
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  useEffect(() => {
    const fetchTodayWords = async () => {
      if (!user) return;

      const { data, error } = await getTodayVocabularies(user.id);

      if (error) {
        console.error(error);
        return;
      }

      const shuffledWords = (data || []).sort(() => Math.random() - 0.5);

      setVocabularies(shuffledWords);
    };

    fetchTodayWords();
  }, [user]);

  const normalizeVietnamese = (text: string) => {
    return text
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
      .replace(/đ/g, "d");
  };

  const checkAnswer = () => {
    const correctAnswer = vocabularies[currentIndex]?.vietnamese || "";

    const isCorrect =
      normalizeVietnamese(userAnswer) === normalizeVietnamese(correctAnswer);

    setShowAnswer(true);

    if (isCorrect) {
      setIsAnswerCorrect(true);
      setQuizResult("✅ Chính xác");
    } else {
      setIsAnswerCorrect(false);
      setQuizResult("❌ Sai rồi.");
    }
  };

  const handleReview = async (quality: "forgot" | "hard" | "easy") => {
    const currentWord = vocabularies[currentIndex];

    if (!currentWord) return;

    let repetition = currentWord.repetition;
    let intervalDays = currentWord.interval_days;
    let easeFactor = currentWord.ease_factor;

    switch (quality) {
      case "forgot":
        repetition = 0;
        intervalDays = 1;
        easeFactor = Math.max(1.3, easeFactor - 0.2);
        break;

      case "hard":
        repetition += 1;
        intervalDays = Math.max(1, Math.round(intervalDays * 1.2));
        break;

      case "easy":
        repetition += 1;

        if (intervalDays === 0) {
          intervalDays = 1;
        }

        intervalDays = Math.round(intervalDays * easeFactor);

        easeFactor += 0.1;
        break;
    }

    const { error } = await updateVocabularyReview(
      currentWord.id,
      repetition,
      intervalDays,
      easeFactor,
    );

    if (error) {
      alert(error.message);
      return;
    }

    const remainingWords = vocabularies.filter(
      (_, index) => index !== currentIndex,
    );

    setVocabularies(remainingWords);

    if (remainingWords.length === 0) {
      alert("🎉 Bạn đã hoàn thành buổi học hôm nay!");
    }

    setCurrentIndex(0);
    setShowAnswer(false);
    setUserAnswer("");
    setQuizResult("");
    setIsAnswerCorrect(false);
  };

  const playAudio = () => {
    const audioUrl = vocabularies[currentIndex]?.audio_url;

    if (!audioUrl) {
      alert("Từ này chưa có file phát âm.");
      return;
    }

    const audio = new Audio(audioUrl);
    audio.play();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Header showBackButton={true} />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">🎯 Học hôm nay</h1>

        <div className="mb-4 text-center text-gray-600">
          {vocabularies.length > 0
            ? `Từ ${currentIndex + 1} / ${vocabularies.length}`
            : "Không có từ cần ôn"}
        </div>

        {vocabularies.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p>🎉 Hôm nay không có từ nào cần ôn.</p>
          </div>
        ) : (
          <div className="min-h-8.75 rounded-2xl bg-white p-10 shadow-xl text-center flex flex-col justify-center">
            <div className="flex items-center justify-center gap-4">
              <h2 className="text-4xl font-bold">
                {vocabularies[currentIndex]?.english}
              </h2>

              <button
                onClick={playAudio}
                className="rounded-full bg-blue-100 p-3 hover:bg-blue-200"
              >
                🔊
              </button>
            </div>

            {vocabularies[currentIndex]?.part_of_speech && (
              <span className="mt-2 rounded bg-blue-100 px-3 py-1 text-sm text-blue-700">
                {vocabularies[currentIndex].part_of_speech}
              </span>
            )}

            {vocabularies[currentIndex]?.phonetic && (
              <p className="mt-2 text-xl text-gray-500">
                {vocabularies[currentIndex].phonetic}
              </p>
            )}

            <div className="mt-8">
              <input
                type="text"
                placeholder="Nhập nghĩa tiếng Việt..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    checkAnswer();
                  }
                }}
                className="w-full rounded border p-3 text-center"
              />

              <button
                onClick={checkAnswer}
                className="mt-4 rounded bg-purple-600 px-6 py-3 text-white"
              >
                Kiểm tra
              </button>

              {quizResult && (
                <p className="mt-4 text-lg font-semibold">{quizResult}</p>
              )}
            </div>

            {showAnswer && (
              <div className="mt-6">
                <p className="text-2xl">
                  {vocabularies[currentIndex]?.vietnamese}
                </p>

                {vocabularies[currentIndex]?.example && (
                  <p className="mt-4 text-gray-500">
                    Ví dụ: {vocabularies[currentIndex]?.example}
                  </p>
                )}

                {quizResult && (
                  <div className="mt-8 flex justify-center gap-4">
                    <button
                      onClick={() => handleReview("forgot")}
                      className="rounded bg-red-500 px-6 py-3 text-white"
                    >
                      😫 Quên
                    </button>

                    {isAnswerCorrect && (
                      <>
                        <button
                          onClick={() => handleReview("hard")}
                          className="rounded bg-yellow-500 px-6 py-3 text-white"
                        >
                          🙂 Khó
                        </button>

                        <button
                          onClick={() => handleReview("easy")}
                          className="rounded bg-green-500 px-6 py-3 text-white"
                        >
                          😀 Dễ
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudyPage;
