import { useSession } from "@clerk/clerk-expo";
import { useEffect, useRef } from "react";

const SessionStateHandler = () => {
  const { session } = useSession();
  const hasTouched = useRef(false);

  useEffect(() => {
    if (session && !hasTouched.current) {
      hasTouched.current = true;
      session?.touch?.();
    }
  }, [session]);

  return null;
};

export default SessionStateHandler;
