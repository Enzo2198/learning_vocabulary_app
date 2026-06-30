import { supabase } from "./supabase";

// Thêm từ vựng mới
export const addVocabulary = async (
  userId: string,
  english: string,
  vietnamese: string,
  category: string,
  example?: string,
) => {
  const { data, error } = await supabase
    .from("vocabularies")
    .insert([
      {
        user_id: userId,
        english,
        vietnamese,
        category,
        example,
      },
    ])
    .select();

  return { data, error };
};

// Lấy danh sách từ vựng của người dùng
export const getVocabularies = async (userId: string) => {
  const { data, error } = await supabase
    .from("vocabularies")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
};

// Lấy danh sách từ vựng cần ôn tập hôm nay
export const getTodayVocabularies = async (userId: string) => {
  const today = new Date().toISOString();

  const { data, error } = await supabase
    .from("vocabularies")
    .select("*")
    .eq("user_id", userId)
    .lte("next_review_date", today)
    .order("next_review_date", { ascending: true });

  return { data, error };
};

// Cập nhật ngày ôn lại tiếp theo
export const updateVocabularyReview = async (
  vocabularyId: string,
  repetition: number,
  intervalDays: number,
  easeFactor: number,
) => {
  const nextReviewDate = new Date();

  nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays);

  const { data, error } = await supabase
    .from("vocabularies")
    .update({
      repetition,
      interval_days: intervalDays,
      ease_factor: easeFactor,
      next_review_date: nextReviewDate.toISOString(),
    })
    .eq("id", vocabularyId);

  return { data, error };
};

// Lấy số liệu thống kê từ vựng
export async function getStatistics(userId: string) {
  const today = new Date().toISOString();

  const { count: totalWords, error: totalError } = await supabase
    .from("vocabularies")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  const { count: todayReviewCount, error: reviewError } = await supabase
    .from("vocabularies")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .lte("next_review_date", today);

  const { count: rememberedCount, error: rememberedError } = await supabase
    .from("vocabularies")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("repetition", 5);

  return {
    totalWords: totalError ? 0 : totalWords,
    todayReviewCount: reviewError ? 0 : todayReviewCount,
    rememberedCount: rememberedError ? 0 : rememberedCount,
  };
}

// Xóa từ vựng
export async function deleteVocabulary(vocabularyId: string) {
  const { error } = await supabase
    .from("vocabularies")
    .delete()
    .eq("id", vocabularyId);

  return { error };
}

// Chỉnh sửa từ vựng
export async function getVocabularyById(id: string) {
  const { data, error } = await supabase
    .from("vocabularies")
    .select("*")
    .eq("id", id)
    .single();

  return { data, error };
}

export async function updateVocabulary(
  id: string,
  english: string,
  vietnamese: string,
  example: string,
) {
  const { error } = await supabase
    .from("vocabularies")
    .update({
      english,
      vietnamese,
      example,
    })
    .eq("id", id);

  return { error };
}

// Lấy thống kê theo chủ đề
export async function getCategoryStatistics(userId: string) {
  const { data, error } = await supabase
    .from("vocabularies")
    .select("category")
    .eq("user_id", userId);

  if (error || !data) return [];

  const groupedData = data.reduce((acc: Record<string, number>, item) => {
    const category = item.category || "Chưa phân loại";

    acc[category] = (acc[category] || 0) + 1;

    return acc;
  }, {});

  return Object.entries(groupedData).map(([category, total]) => ({
    category,
    total,
  }));
}
