# Task Plan: Vercel CI/CD Workflow 구성

**Issue**: [#22](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/22)
**Type**: Chore
**Created**: 2026-01-25
**Status**: Completed

---

## 1. Overview

### Problem Statement

현재 프로젝트에는 CI/CD 파이프라인이 구성되어 있지 않습니다.

- GitHub Actions 워크플로우 없음
- Vercel 배포 설정 없음
- 배포 자동화 없음

### Objectives

1. **Vercel 배포 자동화**: main 브랜치 push 시 Production 자동 배포
2. **로컬 배포 테스트**: `pnpm run deploy`로 로컬에서 배포 테스트 가능

### Scope

**In Scope**:

- `.github/workflows/deploy.yml` - Production 배포 워크플로우
- `.github/scripts/deploy.sh` - 배포 스크립트
- `vercel.json` - Vercel 설정 (SPA 라우팅)
- `package.json` - deploy 스크립트 추가

**Out of Scope**:

- CI 워크플로우 (PR 검증) - 추후 별도 이슈
- API 프록시 설정 - 추후 필요 시 별도 이슈
- 테스트 프레임워크 도입 - 별도 이슈

---

## 2. Requirements

### Functional Requirements

**FR-1**: Production 자동 배포

- main 브랜치에 push 시 Vercel Production 환경에 자동 배포
- GitHub Actions에서 deploy.sh 스크립트 실행

**FR-2**: 로컬 배포 테스트

- `pnpm run deploy`로 로컬에서 배포 테스트 가능
- `.env` 파일의 환경변수 자동 로드 (dotenv-cli)

**FR-3**: SPA 라우팅 지원

- 모든 경로 → `/index.html` (Client-side routing)

### Technical Requirements

**TR-1**: Vite + React 빌드 호환

- 프레임워크: Vite
- 빌드 출력: `dist/` 디렉토리
- 빌드 명령: `pnpm run build`

**TR-2**: GitHub Actions 설정

- Runner: `ubuntu-latest`
- Node.js: `22`
- Package Manager: `pnpm@10.0.0`
- 캐싱: pnpm store 캐시 적용

**TR-3**: Vercel CLI 사용

- `npx vercel pull`: 환경 변수 가져오기
- `npx vercel build`: 빌드
- `npx vercel deploy --prebuilt`: 배포

---

## 3. Architecture & Design

### Directory Structure

```
project/
├── .github/
│   ├── scripts/
│   │   └── deploy.sh           # 배포 스크립트
│   └── workflows/
│       └── deploy.yml          # Production 배포 워크플로우
├── vercel.json                 # Vercel 설정
└── package.json                # deploy 스크립트 추가
```

### Workflow Architecture

```
[main 브랜치 Push]
       ↓
   deploy.yml 실행
       ↓
┌─────────────────┐
│ 1. Checkout     │
│ 2. Setup pnpm   │
│ 3. Setup Node   │
│ 4. Install deps │
│ 5. Install CLI  │
│ 6. Run deploy.sh│
└─────────────────┘
       ↓
   [Production 배포 완료]
```

### Configuration Files

**vercel.json**:

```json
{
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install",
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**deploy.sh**:

```bash
#!/bin/bash
set -e
npx vercel pull --yes --environment=production --token=$VERCEL_TOKEN
npx vercel build --prod --token=$VERCEL_TOKEN
npx vercel deploy --prebuilt --prod --token=$VERCEL_TOKEN
```

**package.json** (추가된 스크립트):

```json
{
  "scripts": {
    "deploy": "dotenv -- bash .github/scripts/deploy.sh"
  }
}
```

---

## 4. Implementation Plan

### Phase 1: Vercel 설정

- [x] `vercel.json` 생성

### Phase 2: 배포 스크립트

- [x] `.github/scripts/deploy.sh` 생성
- [x] `package.json`에 deploy 스크립트 추가
- [x] `dotenv-cli` 설치

### Phase 3: GitHub Actions 워크플로우

- [x] `.github/workflows/deploy.yml` 생성

### Phase 4: 환경 설정

- [x] `vercel link`로 프로젝트 연결
- [x] GitHub Secrets 등록 (VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID)
- [x] 로컬 배포 테스트 완료

---

## 5. Quality Gates

### Acceptance Criteria

- [x] main 브랜치 push 시 Production 자동 배포
- [x] `pnpm run deploy`로 로컬 배포 테스트 가능
- [x] SPA 라우팅 정상 동작
- [x] GitHub Secrets 설정 완료

### Validation

- [x] 로컬 배포 테스트: https://27th-web-team-3-fe.vercel.app

---

## 6. Dependencies

### GitHub Secrets (설정 완료)

| Secret              | Value                              |
| ------------------- | ---------------------------------- |
| `VERCEL_TOKEN`      | (설정됨)                           |
| `VERCEL_ORG_ID`     | `team_Bz7Ncem28VdysKjQgwqZh4ET`    |
| `VERCEL_PROJECT_ID` | `prj_pNByFTcKIRfvNCX2DDaihyvrmoMD` |

---

## 7. References

### Related Issues

- Issue [#22](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/22): Vercel CI/CD Workflow 구성

### External Resources

- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

## 8. Implementation Summary

**Completion Date**: 2026-01-25
**Implemented By**: Claude Opus 4.5

### Changes Made

**Added Files**:

- `vercel.json` - Vercel 빌드 설정 + SPA 라우팅
- `.github/workflows/deploy.yml` - Production 배포 워크플로우
- `.github/scripts/deploy.sh` - 배포 스크립트

**Modified Files**:

- `package.json` - deploy 스크립트 추가, dotenv-cli 추가
- `pnpm-lock.yaml` - dotenv-cli 의존성 추가
- `.gitignore` - .vercel 폴더 자동 추가됨

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed

### Deployment URL

- Production: https://27th-web-team-3-fe.vercel.app

### Deviations from Plan

**Added**:

- 로컬 배포 테스트용 `pnpm run deploy` 스크립트 (dotenv-cli 사용)

**Changed**:

- CI 워크플로우(ci.yml) 제외 - 추후 별도 이슈로 진행

**Skipped**:

- 없음

---

**Plan Status**: Completed
**Last Updated**: 2026-01-25
**Next Action**: 커밋 및 PR 생성
