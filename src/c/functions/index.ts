import { HERO_TURNING_RATE } from "../../app_config";

export const log = (message: any, message_two?: any) => {
  message_two
    ? console.log(
        `%c ${message}: %c ${message_two}:`,
        `color:white`,
        `color:green`
      )
    : console.log(`%c ${message}:`, `color:yellow`);
};

export const lockCamera = (
  camera: React.RefObject<any>,
  object: React.RefObject<any>
) => {
  camera.current.position.x = object.current.position.x;
  camera.current.position.z = object.current.position.z + 4;
  camera.current.position.y = object.current.position.y + 2.4;
};

export const PIchecker = (current_value: number) => {
  if (Math.abs(Math.PI - current_value) < 0.1) {
    return true;
  }
};

export const randomWithinRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) - max;
};

export const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
  let a = x2 - x1;
  let b = y2 - y1;

  return Math.sqrt(a * a + b * b);
};

export const limitTurningAngle = (current_value: number) => {
  if (current_value > Math.PI + HERO_TURNING_RATE) {
    return Math.PI + HERO_TURNING_RATE;
  }
  if (current_value < Math.PI - HERO_TURNING_RATE) {
    return Math.PI - HERO_TURNING_RATE;
  }
  if (
    current_value > Math.PI - HERO_TURNING_RATE &&
    current_value < Math.PI + HERO_TURNING_RATE
  ) {
    return current_value;
  }
};

//END
