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
    <header className="mb-6 flex items-center justify-between rounded-xl bg-white px-3 py-3 shadow sm:px-5">
      <div className="flex w-20 justify-start sm:w-32">
        {showBackButton && (
          <button
            onClick={() => navigate(-1)}
            className="rounded bg-gray-200 px-2 py-1 text-sm hover:bg-gray-300 sm:px-4 sm:py-2 sm:text-base"
          >
            ←<span className="ml-1 hidden sm:inline">Quay lại</span>
          </button>
        )}
      </div>

      <h1 className="truncate px-2 text-center text-lg font-bold sm:text-2xl">
        📚 Spaced Repetition
      </h1>

      <div className="flex w-20 justify-end sm:w-32">
        <button
          onClick={handleLogout}
          className="rounded bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600 sm:px-4 sm:py-2 sm:text-base"
        >
          <span className="sm:hidden">🚪</span>
          <span className="hidden sm:inline">Đăng xuất</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
