interface SpeechBubbleProps {
  message?: string;
}

export function SpeechBubble({ message }: SpeechBubbleProps) {
  const displayMessage = message || '감정, 상황, 피드백 팁 등에 대해 남겨주세요';

  return (
    <div className="flex flex-col items-center">
      <div className="relative bg-[#DDE1E7] text-[#252222] px-8 py-4 rounded-xl text-center font-medium text-lg">
        {displayMessage}
        <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-4 h-4 bg-[#DDE1E7] rotate-45" />
      </div>
    </div>
  );
}
