import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  getStatistics,
  getCategoryStatistics,
} from "../services/vocabulary.service";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Legend,
} from "recharts";

function StatisticsPage() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalWords: 0,
    reviewTodayCount: 0,
    rememberedCount: 0,
  });

  const [categoryStats, setCategoryStats] = useState<
    { category: string; total: number }[]
  >([]);

  const memoryStats = [
    {
      name: "Đã nhớ",
      value: stats.rememberedCount,
      fill: "#22c55e",
    },
    {
      name: "Chưa nhớ",
      value: stats.totalWords - stats.rememberedCount,
      fill: "#ef4444",
    },
  ];

  const rememberPercent =
    stats.totalWords === 0
      ? 0
      : Math.round((stats.rememberedCount / stats.totalWords) * 100);

  useEffect(() => {
    const fetchStatistics = async () => {
      if (!user) return;

      const data = await getStatistics(user.id);

      setStats({
        totalWords: data.totalWords || 0,
        reviewTodayCount: data.reviewTodayCount || 0,
        rememberedCount: data.rememberedCount || 0,
      });

      const categoryData = await getCategoryStatistics(user.id);

      setCategoryStats(categoryData || []);
    };

    fetchStatistics();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Header showBackButton={true} />

      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-center text-4xl font-bold">
          📈 Thống kê học tập
        </h1>

        {/* Thẻ thống kê */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 text-center shadow">
            <h2 className="text-xl font-semibold">Tổng số từ</h2>
            <p className="mt-4 text-5xl font-bold">{stats.totalWords}</p>
          </div>

          <div className="rounded-xl bg-white p-6 text-center shadow">
            <h2 className="text-xl font-semibold">Cần ôn hôm nay</h2>
            <p className="mt-4 text-5xl font-bold">{stats.reviewTodayCount}</p>
          </div>

          <div className="rounded-xl bg-white p-6 text-center shadow">
            <h2 className="text-xl font-semibold">Đã ghi nhớ</h2>

            <p className="mt-4 text-5xl font-bold">{stats.rememberedCount}</p>

            <p className="mt-2 text-lg text-green-500">
              {rememberPercent}% tổng số từ
            </p>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2">
          {/* Biểu đồ */}
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-6 text-center text-2xl font-bold">
              📚 Từ vựng theo chủ đề
            </h2>

            {categoryStats.length === 0 ? (
              <p className="text-center text-gray-500">Chưa có dữ liệu.</p>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={categoryStats}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="category" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Bar
                    dataKey="total"
                    radius={[8, 8, 0, 0]}
                    fill="#3b82f6"
                    animationDuration={1000}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-6 text-center text-2xl font-bold">
              🥧 Tỷ lệ ghi nhớ
            </h2>

            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={memoryStats}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  animationDuration={1000}
                  labelLine={false}
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    percent,
                  }) => {
                    const RADIAN = Math.PI / 180;
                    const radius =
                      Number(innerRadius) +
                      (Number(outerRadius) - Number(innerRadius)) * 0.5;

                    const x =
                      Number(cx) + radius * Math.cos(-(midAngle ?? 0) * RADIAN);

                    const y =
                      Number(cy) + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

                    return (
                      <text
                        x={x}
                        y={y}
                        fill="white"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={18}
                        fontWeight="bold"
                      >
                        {`${((percent || 0) * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatisticsPage;
