import IcNote from '@/shared/ui/logos/IcNote';

export function RetrospectEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <IcNote className="h-9 mb-4" />
      <p className="text-body-2 text-gray-500">회고 내역이 없어요</p>
    </div>
  );
}
