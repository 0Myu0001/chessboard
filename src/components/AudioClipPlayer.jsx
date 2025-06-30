import { useRef, useState, useEffect } from "react";
export default function AudioClipPlayer() {
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);
  const sourceRef = useRef(null);
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [progress, setProgress] = useState({});
  const clips = [
    { label: "1)チェス暴動", file: "segments/segment1.m4a", volume: 3.0 },
    { label: "2)今日は皆さんに昔話を聞かせましょう。", file: "segments/segment2.m4a", volume: 2.5 },
    { label: "3)昔々、科挙に落ち続ける青年がいました。", file: "segments/segment3.m4a", volume: 2.5 },
    { label: "4)彼は試験を重ねる〜自分に疑問を持ち始めます。", file: "segments/segment4.m4a", volume: 2.5 },
    { label: "5)不満が溜まった彼は〜「チェス暴動」に発展しました。", file: "segments/segment5.m4a", volume: 2.5 },
    { label: "6)暴動の最中、青年は瓦礫の中の一枚の紙切れを拾います。", file: "segments/segment6.m4a", volume: 2.5 },
    { label: "7)グイチーライ", file: "segments/segment7.m4a", volume: 2.5 },
    { label: "8)その一言が彼の心を動かしました", file: "segments/segment8.m4a", volume: 2.5 },
    { label: "9)「俺は何をしているんだ」", file: "segments/segment9.m4a", volume: 2.5 },
    { label: "10)青年は本当に大切なものに気づいたのです。〜 Congratulations 地球", file: "segments/segment10.m4a", volume: 2.5 },
    { label: "11)王様もいないこの盤上で僕らはどんな役を与えられたんだろうか", file: "segments/segment11.m4a", volume: 2.5 },
  ];

  // Web Audio APIの初期化
  useEffect(() => {
    const initAudioContext = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.connect(audioContextRef.current.destination);
      }
    };

    // ユーザーのインタラクション後にAudioContextを初期化
    const handleFirstInteraction = () => {
      initAudioContext();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

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
        setCurrentPlaying(null);
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentPlaying]);

  const play = async (file, index) => {
    try {
      // 既存の再生を停止
      if (sourceRef.current) {
        sourceRef.current.stop();
        sourceRef.current.disconnect();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }

      // AudioContextがサスペンド状態の場合は再開
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      if (!audioContextRef.current || !gainNodeRef.current) return;

      // 音声ファイルを取得
      const response = await fetch(file);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);

      // 新しいソースを作成
      sourceRef.current = audioContextRef.current.createBufferSource();
      sourceRef.current.buffer = audioBuffer;

      // ゲインを設定（音量増幅）
      gainNodeRef.current.gain.value = clips[index].volume;

      // 接続
      sourceRef.current.connect(gainNodeRef.current);

      // 進捗追跡のためのダミーaudio要素も使用
      if (audioRef.current) {
        audioRef.current.src = file;
        audioRef.current.currentTime = 0;
        audioRef.current.volume = 0; // Web Audio APIで音量制御するため0に設定
        audioRef.current.play();
      }

      // 再生開始
      setCurrentPlaying(index);
      sourceRef.current.start();

      // 終了時の処理
      sourceRef.current.onended = () => {
        setProgress(prev => ({
          ...prev,
          [index]: 100
        }));
        setCurrentPlaying(null);
      };

    } catch (error) {
      console.error('Audio playback error:', error);
      // フォールバック：通常のHTML5 audioで再生
      if (audioRef.current) {
        audioRef.current.src = file;
        audioRef.current.volume = Math.min(clips[index].volume, 1.0);
        audioRef.current.currentTime = 0;
        setCurrentPlaying(index);
        audioRef.current.play();
      }
    }
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

/*
  チェス暴動はいけるでしょう？
  ー家居に落ち続ける青年がいましたまではそのまま
  合格が逃げる寸劇
  合格がフェードアウトしたら4番
  5番のあと、しょうえいが切り掛かってきゃーという悲鳴が聞こえる
  ５番が終わったら、みんなが倒れ終わるまで待つ、合図が出る
*/