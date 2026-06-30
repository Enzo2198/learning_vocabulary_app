import { useState } from "react";
import { signIn, signUp } from "../services/auth.service";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    const { error } = await signUp(email, password);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Đăng ký thành công");
    navigate("/");
  };

  const handleSignIn = async () => {
    const { error } = await signIn(email, password);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Đăng nhập thành công");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-96 rounded-lg border p-6 shadow">
        <h1 className="mb-6 text-center text-2xl font-bold">Đăng nhập</h1>

        <input
          type="email"
          placeholder="Email"
          className="mb-4 w-full rounded border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          className="mb-4 w-full rounded border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignIn}
          className="mb-2 w-full rounded bg-blue-500 p-2 text-white"
        >
          Đăng nhập
        </button>

        <button
          onClick={handleSignUp}
          className="w-full rounded bg-green-500 p-2 text-white"
        >
          Đăng ký
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
