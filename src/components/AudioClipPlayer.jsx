import { useRef } from "react";
export default function AudioClipPlayer() {
  const audioRef = useRef(null);
  const clips = [
    { label: "0:00 - 0:03", file: "/segments/segment1.m4a" },
    { label: "0:03 - 0:07", file: "/segments/segment2.m4a" },
    { label: "0:07 - 0:13", file: "/segments/segment3.m4a" },
    { label: "0:13 - 0:39", file: "/segments/segment4.m4a" },
    { label: "0:39 - 0:45", file: "/segments/segment5.m4a" },
    { label: "0:45 - 0:47", file: "/segments/segment6.m4a" },
    { label: "0:47 - 0:51", file: "/segments/segment7.m4a" },
    { label: "0:51 - 0:54", file: "/segments/segment8.m4a" },
    { label: "0:54 - 1:07", file: "/segments/segment9.m4a" },
    { label: "1:07 - 1:15", file: "/segments/segment10.m4a" },
  ];
  const play = (file) => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.src = file;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };
  return (
    <section className="max-w-md mx-auto bg-white shadow-xl rounded-2xl p-6 space-y-3">
      {clips.map((clip, i) => (
        <button
          key={i}
          onClick={() => play(clip.file)}
          className="w-full text-left px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
        >
          {clip.label}
        </button>
      ))}
      <audio ref={audioRef} className="hidden" />
    </section>
  );
}