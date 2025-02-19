import { useEffect } from "react";
import useUserContext from "../hooks/contextHooks";

const Logout = () => {
  const {handleLogout} = useUserContext();

  useEffect(() => {
    handleLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>Logout</h1>
    </div>
  );
}

export default Logout;
