import { useNavigate } from "react-router-dom";

export function useLoginRedirect() {
  const navigate = useNavigate();
  return (data) => {
    if (data.token) {
      localStorage.setItem("token", data.token);
      navigate("/dashboard-app");
    }
  };
}
