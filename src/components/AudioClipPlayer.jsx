import { useRef } from "react";
export default function AudioClipPlayer() {
  const audioRef = useRef(null);
  const clips = [
    { label: "1)チェス暴動", file: "segments/segment1.m4a" },
    { label: "2)今日は皆さんに昔話を聞かせましょう。", file: "segments/segment2.m4a" },
    { label: "3)昔々、科挙に落ち続ける青年がいました。", file: "segments/segment3.m4a" },
    { label: "4)彼は試験を重ねる〜「チェス暴動」に発展しました。", file: "segments/segment4.m4a" },
    { label: "5)暴動の最中、青年は瓦礫の中の一枚の紙切れを拾います。", file: "segments/segment5.m4a" },
    { label: "0:45 - 0:47", file: "segments/segment6.m4a" },
    { label: "その一言が彼の心を動かしました", file: "segments/segment7.m4a" },
    { label: "「俺は何をしているんだ」", file: "segments/segment8.m4a" },
    { label: "青年は本当に大切なものに気づいたのです。〜 Congratulations 地球", file: "segments/segment9.m4a" },
    { label: "王様もいないこの盤上で僕らはどんな役を与えられたんだろうか", file: "segments/segment10.m4a" },
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