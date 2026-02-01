import { RetrospectMethod } from '@/shared/api/generated/index';

export const RETROSPECT_METHOD_LABELS: Record<string, string> = {
  [RetrospectMethod.KPT]: 'KPT',
  [RetrospectMethod.FOUR_L]: '4L',
  [RetrospectMethod.FIVE_F]: '5F',
  [RetrospectMethod.PMI]: 'PMI',
  [RetrospectMethod.FREE]: '자유 회고',
};

export const RETROSPECT_METHOD_DESCRIPTIONS: Record<string, string> = {
  [RetrospectMethod.KPT]: '스프린트 단위 프로젝트를 회고할 때',
  [RetrospectMethod.FOUR_L]: '팀 분위기와 관계, 배움을 돌아볼 떄',
  [RetrospectMethod.FIVE_F]: '중장기 프로젝트를 회고할 때',
  [RetrospectMethod.PMI]: '빠른 회고가 필요할 때',
  [RetrospectMethod.FREE]: '맞춤형 회고를 진행할때',
};
