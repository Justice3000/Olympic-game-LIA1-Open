import { useEffect } from "react";

export default function useKey(
  button: string[] | string,
  stateDispatch: (bool: boolean) => void
) {
  const pressed: any = [];
  useEffect(() => {
    const _onKeyDown = (e: KeyboardEvent) => {
      if (button.indexOf(e.key) > -1) {
        const isHeld = !!pressed[e.code]; //cast as boolean
        pressed[e.code] = true;
        if (!isHeld) stateDispatch(true);
      }
    };
    const _onKeyUp = (e: KeyboardEvent) => {
      if (button.indexOf(e.key) > -1) {
        pressed[e.code] = false;
        stateDispatch(false);
      }
    };

    window.addEventListener("keydown", _onKeyDown, { passive: true });
    window.addEventListener("keyup", _onKeyUp, { passive: true });
    return () => {
      window.removeEventListener("keydown", _onKeyDown);
      window.removeEventListener("keyup", _onKeyUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [button, stateDispatch]);
}
