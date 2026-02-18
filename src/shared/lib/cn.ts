import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'body-1',
            'body-2',
            'caption',
            'caption-1',
            'caption-2',
            'caption-3',
            'caption-3-medium',
            'caption-4',
            'caption-5',
            'caption-6',
            'long-1',
            'long-2',
            'sub-title-0',
            'sub-title-1',
            'sub-title-2',
            'sub-title-3',
            'sub-title-4',
            'sub-title-5',
            'sub-title-6',
            'title-1',
            'title-2',
            'title-3',
            'title-4',
            'title-5',
            'title-6',
            'title-7',
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
