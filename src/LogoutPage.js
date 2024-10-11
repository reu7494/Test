import { useNavigate } from "react-router-dom";

export default function LogoutPage({ setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setUser(null);
    navigate("/Login");
  };

  return (
    <div className="logout-container">
      <button className="use-logout" onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  );
}
