import { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../assets/assets";

export const playerContext = createContext();

const PlayerContextProvider = (props) => {
 const audioRef = useRef();
 const seekBg = useRef();
  const seekBar = useRef();

  const [track, setTrack] = useState(songsData[0]);
  const [playStatus, setPlayStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: {
      minute:0,
      second:0,
    },
    totalTime:{
      minute:0,
      second:0,
    }
  })

  const play = () => {
    audioRef.current.play();
    setPlayStatus(true)
  }

  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  }

  const playWithId = async (id) => {
    await setTrack(songsData[id]);
    await audioRef.current.play();
    setPlayStatus(true);
  }
  const previous = async () => {
    if (track.id>0) {
      await setTrack(songsData[track.id-1]);
      await audioRef.current.play();
      setPlayStatus(true);
    }
  }
  const next = async () => {
    if (track.id < songsData.length - 1) {
      await setTrack(songsData[track.id + 1]);
      await audioRef.current.play();
      setPlayStatus(true);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      audioRef.current.ontimeupdate = () => {
        seekBar.current.style.width =(Math.floor(audioRef.current.currentTime/audioRef.current.duration*100))+"%"
        setTime(
          {
            currentTime: {
              second:Math.floor(audioRef.current.currentTime % 60),
              minute:Math.floor(audioRef.current.currentTime / 60),
            },
            totalTime:{
              second:Math.floor(audioRef.current.duration % 60),
              minute:Math.floor(audioRef.current.duration / 60),
            }
          }
        )
      }
    },1000)
  })

  const contextValue = {
       audioRef,
       seekBar,
       seekBg,
       track,
       setTrack,
       playStatus,setPlayStatus,
       time,setTime,
       play,pause,
       playWithId,
       previous,
       next,
  }
   return (
    <playerContext.Provider value={contextValue}>
      {props.children}
    </playerContext.Provider>
   )
}
export default PlayerContextProvider;