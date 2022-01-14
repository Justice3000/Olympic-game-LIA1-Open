import {
  CONTROL_LEFT,
  CONTROL_RIGHT,
  CONTROL_SPEED_UP,
} from "../app_config/index";
import { useStore } from "../zustand/zStore";
import useKey from "./hooks/useKey";

export function Controls() {
  const dispatch = useStore((state) => state.set);
  useKey(CONTROL_LEFT, (bool: boolean) =>
    dispatch((state: any) => ({
      ...state,
      keyPressed: { ...state.keyPressed, left: bool },
    }))
  );
  useKey(CONTROL_RIGHT, (bool: boolean) =>
    dispatch((state: any) => ({
      ...state,
      keyPressed: { ...state.keyPressed, right: bool },
    }))
  );
  useKey(CONTROL_SPEED_UP, (bool: boolean) =>
    dispatch((state: any) => ({
      ...state,
      keyPressed: { ...state.keyPressed, up: bool },
    }))
  );

  return null;
}
