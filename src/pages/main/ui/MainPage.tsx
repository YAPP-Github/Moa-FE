import { NoTeamEmptyState } from '@/features/team';

export function MainPage() {
  // TODO: 서버 API 추가 후 팀 유무에 따른 조건부 렌더링 구현
  return <NoTeamEmptyState />;
}
