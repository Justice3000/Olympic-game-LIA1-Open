import { useEffect, useLayoutEffect, useRef } from "react";
import { useGLTF, useAnimations, PerspectiveCamera } from "@react-three/drei";
import { useStore, data } from "../zustand/zStore";
import { useFrame } from "@react-three/fiber";
import { limitTurningAngle, lockCamera, PIchecker } from "./functions";
import {
  GAME_SPEED_BASE,
  HUD_UPDATE_RATE,
  OBJECT_TURN_RATE,
  CORRECTIONAL_DELTA,
} from "../app_config";

function Model() {
  const { nodes, materials, animations } = useGLTF(
    "./models/pedro.glb"
  ) as DreiGLTF;

  const pedro = useStore((s) => s.pedro);
  const camera = useStore((s) => s.camera);
  const controls = useRef<any>(useStore.getState().keyPressed);

  const gameStarted = useStore((s) => s.gameStarted);

  //why deprecated?
  useEffect(() => {
    useStore.subscribe(
      (c) => (controls.current = c),
      (state) => state.keyPressed
    );
  });

  const { actions } = useAnimations(animations, pedro);

  // Camera mod
  useLayoutEffect(() => {
    camera.current.position.set(0, -3.6, -0.3);
  }, [camera]);

  //rotate pedro before rendering
  useLayoutEffect(() => {
    pedro.current.rotation.y = Math.PI;
  });

  // points and velocity sent to store, roughly every second or so
  let timer = 0;
  useFrame((state, delta) => {
    const new_timer = state.clock.getElapsedTime();
    if (!pedro.current) {
      return;
    }

    if (camera.current.rotation.y !== 0 && gameStarted) {
      camera.current.rotation.y = 0;
    } //making sure camera is always pointing to the right direction
    //measuring time in between to not abuse update
    if (new_timer - timer > HUD_UPDATE_RATE) {
      data.points = Math.round(Math.abs(pedro.current.position.z)) / 10;
      timer = new_timer;
      data.velocity = Math.round(data.gameSpeed * GAME_SPEED_BASE);
    }
  });

  useFrame((state, delta) => {
    if (!gameStarted) {
      return null;
    }
    const new_delta = delta * CORRECTIONAL_DELTA;
    pedro.current.position.z -= Math.sqrt(
      data.gameSpeed * delta * GAME_SPEED_BASE
    ); //players speed

    pedro.current.position.x += data.xy * delta * GAME_SPEED_BASE; //x transform rate
    const { left, right, up } = controls.current;

    pedro.current.rotation.z = data.xy * 0.01; //when turning player slightly nods

    //to the left pressed
    if (left && !right) {
      data.xy = Math.min(0.2, data.xy - new_delta);
      pedro.current.rotation.y = limitTurningAngle(
        pedro.current.rotation.y - (data.xy * OBJECT_TURN_RATE) / 100
      );
    }

    //to the right pressed
    if (!left && right) {
      data.xy = Math.max(-0.2, data.xy + new_delta);
      pedro.current.rotation.y = limitTurningAngle(
        pedro.current.rotation.y - (data.xy * OBJECT_TURN_RATE) / 100
      );
    }

    //left and right are being pressed or NOTpressed at the same time
    if ((left && right) || (!left && !right)) {
      if (data.xy < 0) {
        data.xy + new_delta > 0 ? (data.xy = 0) : (data.xy += new_delta);
      }
      if (data.xy > 0) {
        data.xy - new_delta < 0 ? (data.xy = 0) : (data.xy -= new_delta);
      }

      if (pedro.current.rotation.y !== Math.PI) {
        pedro.current.rotation.y > Math.PI
          ? (pedro.current.rotation.y -= new_delta)
          : (pedro.current.rotation.y += new_delta);
      }
      //if current Y coord is really close to PI set it to PI
      PIchecker(pedro.current.rotation.y) &&
        (pedro.current.rotation.y = Math.PI);
    }

    //speed booster
    if (up) {
      pedro.current.position.z -= Math.sqrt(data.level);
      let vel = (data.gameSpeed * delta * GAME_SPEED_BASE)
        .toString()
        .split(".")[1];
      data.velocity = parseInt(vel);

      !actions.animeRun?.isRunning() &&
        actions.animeRun?.play() &&
        actions.run?.stop();
    }

    //animate when up is not pressed
    if (!up && actions.animeRun?.isRunning()) {
      actions.animeRun?.stop();
      actions.animeRun?.reset();
      actions.run?.play();
    }

    //make idling stop when player starts running
    if (gameStarted && data.points < 1) {
      actions?.idle!.stop();
      actions?.run!.play();
    } //animeRun; idle; jump, run

    lockCamera(camera, pedro);
  });

  useLayoutEffect(() => {
    if (!gameStarted) {
      lockCamera(camera, pedro);
      actions.idle?.play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions]);

  return (
    <>
      <PerspectiveCamera
        makeDefault
        ref={camera}
        fov={80}
        position={[0, 2.4, 4]}
      />

      <group ref={pedro} dispose={null} position={[0, -3.6, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={nodes.mixamorigHips} />
          <skinnedMesh
            geometry={nodes.Ch43.geometry}
            material={materials.Ch43_Body}
            skeleton={(nodes as any).Ch43.skeleton} //quickest solution
          />
        </group>
      </group>
    </>
  );
}

useGLTF.preload("./models/pedro.glb");

export default function Pedro() {
  return <Model></Model>;
}
