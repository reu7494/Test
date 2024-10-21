import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function SignOut({ user, setUser, setError }) {
  const navigate = useNavigate();
  const handleDeleteAccount = async () => {
    if (!window.confirm("탈퇴를 진행하시겠습니까?")) return;

    try {
      await fetch(`http://localhost:8008/delete-user/${user.id}`, {
        method: "DELETE",
      });

      localStorage.clear();
      setUser(null);
      Swal.fire({
        title: "",
        text: "회원탈퇴 성공!",
        icon: "success",
      });
      navigate("/");
    } catch (error) {
      setError("Failed to delete account.");
    }
  };
  return <button onClick={handleDeleteAccount}>회원탈퇴</button>;
}
