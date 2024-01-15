import { useEffect, useRef } from "react";

export const useTimeoutInterval = (
  callback: Function,
  fnCondition: Function,
  delay: number
) => {
  const savedCallback = useRef<Function>();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  
  useEffect(() => {
    let id: NodeJS.Timeout;
    const tick = async () => {
      try {
        const response =
          typeof savedCallback.current === "function" &&
          (await savedCallback.current());
        if (fnCondition(response)) {
          id = setTimeout(tick, delay);
        } else {
          clearTimeout(id);
        }
      } catch (e) {
        console.error(e);
      }
    };
    tick();
    return () => id && clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay]);
};
