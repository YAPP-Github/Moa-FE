import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, useState } from 'react';
import { cn } from '@/shared/lib/cn';

const avatarVariants = cva(
  'relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[#F3F4F5] text-[#6B7583] font-medium select-none',
  {
    variants: {
      size: {
        xs: 'size-6 text-[10px]', // 24px
        sm: 'size-7 text-xs', // 28px
        md: 'size-8 text-xs', // 32px
        lg: 'size-9 text-sm', // 36px
        xl: 'size-12 text-base', // 48px
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/**
 * alt 텍스트에서 이니셜을 추출합니다.
 * 예: "John Doe" → "JD", "홍길동" → "홍"
 */
function getInitials(name?: string): string {
  if (!name) return '';

  const words = name.trim().split(/\s+/);

  // 한글인 경우 첫 글자만
  if (/[\u3131-\u318E\uAC00-\uD7A3]/.test(name)) {
    return words[0]?.charAt(0) || '';
  }

  // 영문인 경우 각 단어의 첫 글자 (최대 2글자)
  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}

interface AvatarProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof avatarVariants> {
  /** 이미지 URL */
  src?: string;
  /** 대체 텍스트 (이미지 설명, 이니셜 생성에도 사용) */
  alt?: string;
  /** 이미지 로드 실패 시 표시할 fallback 콘텐츠 */
  fallback?: React.ReactNode;
}

const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ src, alt, fallback, size, className, ...props }, ref) => {
    const [imageError, setImageError] = useState(false);
    const showFallback = !src || imageError;

    return (
      <span
        ref={ref}
        role="img"
        aria-label={alt}
        className={cn(avatarVariants({ size }), className)}
        {...props}
      >
        {showFallback ? (
          fallback || getInitials(alt) ? (
            <span className="flex items-center justify-center">{fallback || getInitials(alt)}</span>
          ) : null
        ) : (
          <img
            src={src}
            alt={alt || ''}
            className="size-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </span>
    );
  }
);

Avatar.displayName = 'Avatar';

export { Avatar, avatarVariants, getInitials, type AvatarProps };
