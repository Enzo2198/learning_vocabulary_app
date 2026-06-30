import { useNavigate } from "react-router-dom";
import { signOut } from "../services/auth.service";

type HeaderProps = {
  showBackButton?: boolean;
};

function Header({ showBackButton = true }: HeaderProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await signOut();

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/auth");
  };

  return (
    <header className="mb-8 flex items-center justify-between rounded-xl bg-white p-4 shadow">
      <div className="w-32">
        {showBackButton && (
          <button
            onClick={() => navigate(-1)}
            className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
          >
            ← Quay lại
          </button>
        )}
      </div>

      <h1 className="text-2xl font-bold">📚 Spaced Repetition</h1>

      <div className="w-32 flex justify-end">
        <button
          onClick={handleLogout}
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
}

export default Header;
