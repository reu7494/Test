import { useNavigate } from "react-router-dom";

const navigate = useNavigate;

export default function SignOut({ user, setUser, setError }) {
  const handleDeleteAccount = async () => {
    if (!window.confirm("탈퇴를 진행하시겠습니까?")) return;

    try {
      const response = await fetch(
        `http://localhost:8008/delete-user/${user.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete account");

      alert("회원탈퇴 성공");
      setUser(null);
      navigate("/Login");
    } catch (error) {
      console.error("Error deleting account:", error);
      setError("Failed to delete account.");
    }
  };
  return <button onClick={handleDeleteAccount}>회원탈퇴</button>;
}
