/**
 * WriteSidebar - 우측 사이드바 (전체 질문 목록 + 참고자료)
 */

import { useState } from 'react';
import type { ReferenceItem } from '@/features/retrospective/model/types';
import { useOgMetadata } from '@/shared/api/og';

interface WriteSidebarProps {
  questions: string[];
  answers: string[];
  currentQuestionIndex: number;
  onQuestionSelect: (index: number) => void;
  references: ReferenceItem[];
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function ReferenceCard({ url, urlName }: ReferenceItem) {
  const { data: ogData } = useOgMetadata(url);
  const [imgError, setImgError] = useState(false);

  const og = ogData?.result;
  const displayTitle = og?.title || urlName || url;
  const ogImage = og?.image;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block overflow-hidden rounded-[10px] shadow-[0_0_4px_#1C1C1C14]"
    >
      {ogImage && !imgError ? (
        <img
          src={ogImage}
          alt=""
          className="h-[130px] w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="h-[130px] bg-grey-100" />
      )}
      <div className="px-4 py-3">
        <p className="line-clamp-2 text-caption-2 text-grey-800">{displayTitle}</p>
        <p className="mt-1 text-[12px] leading-[130%] text-[#7E7E7E]">{extractDomain(url)}</p>
      </div>
    </a>
  );
}

export function WriteSidebar({
  questions,
  answers,
  currentQuestionIndex,
  onQuestionSelect,
  references,
}: WriteSidebarProps) {
  return (
    <aside className="w-[238px] shrink-0 overflow-y-auto bg-white mr-[70px] pt-10">
      {/* 전체 질문 */}
      <div>
        <h3 className="text-sub-title-1 text-grey-1000">전체 질문</h3>
        <div className="mt-4 flex flex-col gap-3">
          {questions.map((question, index) => (
            <button
              key={`q-${question.slice(0, 20)}`}
              type="button"
              onClick={() => onQuestionSelect(index)}
              className={`cursor-pointer border-l-2 pl-3 text-left text-sub-title-3 ${
                currentQuestionIndex === index
                  ? 'border-[#1C8AFF] text-blue-500'
                  : answers[index]?.trim()
                    ? 'border-grey-800 text-grey-800'
                    : 'border-grey-300 text-grey-800'
              }`}
            >
              질문 {index + 1}. {question}
            </button>
          ))}
        </div>
      </div>

      {/* 참고자료 */}
      {references.length > 0 && (
        <div className="mt-7">
          <h3 className="text-sub-title-1 text-grey-1000">참고자료</h3>
          <div className="mt-3 flex flex-col gap-[10px]">
            {references.map((ref) => (
              <ReferenceCard key={ref.referenceId} {...ref} />
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
