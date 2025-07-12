import { useNavigate, useSearchParams } from "react-router-dom";
import { verificationEmailCallback } from "../apis/user";
import { useEffect } from "react";

function VerifyEmailCallback() {
  const [searchParams, _] = useSearchParams();

  const navigate = useNavigate();

  const onLoad = async () => {
    const res = await verificationEmailCallback(searchParams.get("token"));

    navigate("/register/1")
  }


  useEffect(() => {
    if (searchParams.has("token")) {
      onLoad()
    }
    onLoad();
  }, [searchParams]);

  return (
    <div className="d-flex justify-content-center align-items-center vw-100 vh-100">
      <h1>Verifying email, please wait...</h1>
    </div>
  );
}

export default VerifyEmailCallback;
