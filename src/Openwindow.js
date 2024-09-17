import { useEffect } from "react";

export default function OpenWindowOnLoad() {
  useEffect(() => {
    const url = "https://inherent-danit-orientaluniversity-6510c6dd.koyeb.app/";
    const windowFeatures = "width=550px, height=550px"; // 창 크기 및 위치 설정

    // 새 창 열기
    const newWindow = window.open(url, "_blank", windowFeatures);

    // 창이 성공적으로 열렸는지 확인 (팝업 차단 여부)
    if (newWindow) {
      newWindow.focus();
    } else {
      alert("팝업이 차단되었습니다. 팝업 차단기를 비활성화하세요.");
    }
  }, []);
}
