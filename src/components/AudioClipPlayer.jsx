import { useRef, useState, useEffect } from "react";
export default function AudioClipPlayer() {
  const audioRef = useRef(null);
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [progress, setProgress] = useState({});
  const clips = [
    { label: "1)チェス暴動", file: "segments/segment1.m4a" },
    { label: "2)今日は皆さんに昔話を聞かせましょう。", file: "segments/segment2.m4a" },
    { label: "3)昔々、科挙に落ち続ける青年がいました。", file: "segments/segment3.m4a" },
    { label: "4)彼は試験を重ねる〜自分に疑問を持ち始めます。", file: "segments/segment4.m4a" },
    { label: "5)不満が溜まった彼は〜「チェス暴動」に発展しました。", file: "segments/segment5.m4a" },
    { label: "6)暴動の最中、青年は瓦礫の中の一枚の紙切れを拾います。", file: "segments/segment6.m4a" },
    { label: "7)グイチーライ", file: "segments/segment7.m4a" },
    { label: "8)その一言が彼の心を動かしました", file: "segments/segment8.m4a" },
    { label: "9)「俺は何をしているんだ」", file: "segments/segment9.m4a" },
    { label: "10)青年は本当に大切なものに気づいたのです。〜 Congratulations 地球", file: "segments/segment10.m4a" },
    { label: "11)王様もいないこの盤上で僕らはどんな役を与えられたんだろうか", file: "segments/segment11.m4a" },
  ];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration && currentPlaying !== null) {
        const progressValue = (audio.currentTime / audio.duration) * 100;
        setProgress(prev => ({
          ...prev,
          [currentPlaying]: progressValue
        }));
      }
    };

    const handleEnded = () => {
      if (currentPlaying !== null) {
        setProgress(prev => ({
          ...prev,
          [currentPlaying]: 100
        }));
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentPlaying]);

  const play = (file, index) => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.src = file;
    audioRef.current.currentTime = 0;
    setCurrentPlaying(index);
    audioRef.current.play();
  };
  return (
    <section className="max-w-md mx-auto bg-white shadow-xl rounded-2xl p-6 space-y-3">
      {clips.map((clip, i) => {
        const currentProgress = progress[i] || 0;
        return (
          <button
            key={i}
            onClick={() => play(clip.file, i)}
            className="w-full text-left px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 relative overflow-hidden"
          >
            {/* プログレスバー */}
            <div 
              className="absolute inset-0 bg-blue-200 transition-all duration-100 ease-out"
              style={{ 
                width: `${currentProgress}%`,
                borderRadius: 'inherit'
              }}
            />
            {/* テキスト */}
            <span className="relative z-10">{clip.label}</span>
          </button>
        );
      })}
      <audio ref={audioRef} className="hidden" />
    </section>
  );
}