import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/");
  };

  return (
    <>
      <button className="use-logout" onClick={handleLogout}>
        로그아웃
      </button>
    </>
  );
}
