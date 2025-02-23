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
      <span>Logout</span>
    </div>
  );
}

export default Logout;
