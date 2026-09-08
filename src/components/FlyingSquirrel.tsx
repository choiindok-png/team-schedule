import React, { useState } from 'react';

export const FlyingSquirrel: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [acornsEaten, setAcornsEaten] = useState(12);
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState('다람쥐가 날아다녀요! 🌰');

  const messages = [
    '도토리 숨겨둘 곳 있나요? 🐿️',
    '이번 주 일정도 화이팅! 🌰',
    '나무 타기 쉬는 시간~ 🌳',
    '파스텔 스케치북 구경 중! ✨',
    '오늘도 야근 없는 하루 되세요! 💛'
  ];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    setMessageText(randomMsg);
    setShowMessage(true);
    setAcornsEaten(prev => prev + 1);
    setTimeout(() => {
      setShowMessage(false);
    }, 2500);
  };

  return (
    <div className="pointer-events-auto">
      {/* Flying Squirrel flying across */}
      <div 
        className={`flying-squirrel cursor-pointer group transition-transform hover:scale-125 ${isPaused ? 'animation-paused' : ''}`}
        onClick={handleClick}
        title="클릭하면 다람쥐가 도토리를 먹고 말을 해요!"
      >
        <div className="relative flex items-center">
          {/* Speech bubble */}
          {showMessage && (
            <div className="absolute -top-12 -left-16 bg-[#fffdf0] border-2 border-[#8c7355] text-[#5c4033] px-3 py-1 rounded-2xl text-xs font-bold shadow-md animate-bounce whitespace-nowrap z-50">
              {messageText}
              <div className="absolute bottom-[-6px] right-6 w-2 h-2 bg-[#fffdf0] border-r-2 border-b-2 border-[#8c7355] transform rotate-45"></div>
            </div>
          )}

          {/* Squirrel Character */}
          <div className="text-4xl filter drop-shadow-[2px_3px_0px_rgba(0,0,0,0.15)] animate-acorn select-none">
            🐿️
          </div>
          {/* Floating Acorn */}
          <div className="text-2xl animate-bounce ml-[-12px] mt-[-10px] select-none">
            🌰
          </div>
        </div>
      </div>

      {/* Floating Widget in bottom right to toggle/feed */}
      <div className="fixed bottom-4 right-4 z-40 bg-[#fffdf9]/90 backdrop-blur-sm border-2 border-dashed border-[#b59b84] px-3 py-2 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-jua text-[#5c4033]">
        <span className="animate-pulse">🌰 도토리 {acornsEaten}개</span>
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className="bg-[#ffd1dc] hover:bg-[#ffb6c1] px-2 py-1 rounded-xl border border-[#d1a1ad] transition-all cursor-pointer"
          title={isPaused ? "다람쥐 날리기 재개" : "다람쥐 잠시 멈추기"}
        >
          {isPaused ? '🏃 날리기' : '⏸️ 멈춤'}
        </button>
      </div>
    </div>
  );
};
