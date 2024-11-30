import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function SignOut({ user, setUser, setError }) {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: "정말로 탈퇴하시겠습니까?",
      text: "탈퇴를 진행하면 계정 데이터가 모두 삭제됩니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "네, 탈퇴합니다!",
      cancelButtonText: "취소",
    });

    if (!result.isConfirmed) return;

    try {
      await fetch(`${apiUrl}/api/delete-user/${user.id}`, {
        method: "DELETE",
      });

      localStorage.clear();
      setUser(null);
      await Swal.fire({
        title: "회원탈퇴 성공!",
        text: "계정이 정상적으로 삭제되었습니다.",
        icon: "success",
      });
      navigate("/");
    } catch (error) {
      setError("계정을 삭제하지 못했습니다.");
      Swal.fire({
        title: "오류",
        text: "계정을 삭제하는 중 문제가 발생했습니다.",
        icon: "error",
      });
    }
  };

  return <button onClick={handleDeleteAccount}>회원탈퇴</button>;
}
