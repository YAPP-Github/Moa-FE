export type ToneStyle = 'KIND' | 'POLITE';

export interface RefineRetrospectiveRequest {
  content: string;
  toneStyle: ToneStyle;
  secretKey: string;
}

export interface RefineRetrospectiveResult {
  originalContent: string;
  refinedContent: string;
  toneStyle: ToneStyle;
}

export interface GuideRetrospectiveRequest {
  currentContent: string;
  secretKey: string;
}

export interface GuideRetrospectiveResult {
  currentContent: string;
  guideMessage: string;
}
