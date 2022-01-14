import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { AudioAnalyser, AudioListener, AudioLoader } from "three";
import { useStore, data } from "../zustand/zStore";

//sounds
import crispy from "../audio/crispy.mp3";
//import crispy from "../audio/Blob-Monsters-on-the-Loose.mp3";
import oh_no_sound from "../audio/oh_no_sound.mp3";
import level_up_sound from "../audio/level_up.mp3";
// import fantasy_sound from "../audio/FANTASY.wav";
import THE_END from "../audio/THE_END.wav";

export default function Music() {
  let level = data.level;
  const music_analyzer = useRef();

  const music_player = useRef();
  const game_over_player = useRef();
  const oh_no_player = useRef();
  const level_up_player = useRef();

  const music_bol = useStore((state) => state.music);
  const gameStarted = useStore((state) => state.gameStarted);
  const gameOver = useStore((state) => state.gameOver);

  const [listener] = useState(() => new AudioListener());

  const mainTheme = useLoader(AudioLoader, crispy);
  const gameOverTheme = useLoader(AudioLoader, THE_END);
  const ohNoTheme = useLoader(AudioLoader, oh_no_sound);
  const levelUpTheme = useLoader(AudioLoader, level_up_sound);

  useEffect(() => {
    if (gameOver && music_bol && gameStarted) {
      oh_no_player.current.setBuffer(ohNoTheme);
      oh_no_player.current.setVolume(1.5);
      oh_no_player.current.play();
    }
  });

  useEffect(() => {
    if (music_bol && gameStarted && !gameOver) {
      music_player.current.setBuffer(mainTheme);
      music_player.current.setLoop(true);
      music_player.current.setVolume(1);
      music_player.current.setPlaybackRate(1);
      music_player.current.play();
    } else {
      music_player.current.isPlaying && music_player.current.stop();
    }
  }, [music_bol, mainTheme, gameStarted, gameOver]);

  useEffect(() => {
    music_analyzer.current = new AudioAnalyser(music_player.current, 32);
  });

  useEffect(() => {
    if (gameOver && music_bol) {
      game_over_player.current.setBuffer(gameOverTheme);
      game_over_player.current.play();
    } else {
      game_over_player.current.isPlaying && game_over_player.current.stop();
    }
  }, [gameOver, music_bol, gameOverTheme]);

  useFrame((state, delta) => {
    // music_bol && console.log(music_analyzer.current.getFrequencyData()); //this is dope!!!!

    let rate = 1 + data.level / 100;
    //if rates differ, set new one
    if (!music_player.current.playbackRate !== rate) {
      music_player.current.setPlaybackRate(rate);
    }

    if (level !== data.level && music_bol) {
      //without stop even if we change level every milisecond it will not play until its done with first loop
      level_up_player.current.setBuffer(levelUpTheme);
      if (level_up_player.current.isPlaying) {
        level = data.level;
        return;
      }
      level_up_player.current.setVolume(0.8);
      level_up_player.current.play();
      level = data.level;
    }
  });
  return (
    <group>
      <audio ref={music_player} args={[listener]} />
      <audio ref={game_over_player} args={[listener]} />
      <audio ref={oh_no_player} args={[listener]} />
      <audio ref={level_up_player} args={[listener]} />
    </group>
  );
}
