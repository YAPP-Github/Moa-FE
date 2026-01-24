import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { images } from '@/assets';
import { InviteLinkStep } from '@/components/signin/InviteLinkStep';
import { LoginStep } from '@/components/signin/LoginStep';
import { NicknameStep } from '@/components/signin/NicknameStep';
import { TeamNameStep } from '@/components/signin/TeamNameStep';
import { TeamStep } from '@/components/signin/TeamStep';

type SigninStep = 'login' | 'nickname' | 'team' | 'team-name' | 'invite-link';

export function SigninPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [nickname, setNickname] = useState('');

  const step = (searchParams.get('step') as SigninStep) || 'login';

  const handleKakaoLogin = () => {
    console.log('Kakao login clicked');
    setSearchParams({ step: 'nickname' });
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    setSearchParams({ step: 'nickname' });
  };

  const handleNicknameSubmit = () => {
    if (!nickname.trim()) return;
    console.log('Nickname submitted:', nickname);
    setSearchParams({ step: 'team' });
  };

  const handleTeamSubmit = (teamOption: 'create' | 'join') => {
    console.log('Team option selected:', teamOption);
    if (teamOption === 'create') {
      setSearchParams({ step: 'team-name' });
    } else {
      setSearchParams({ step: 'invite-link' });
    }
  };

  const handleTeamNameSubmit = (teamName: string) => {
    console.log('Team name submitted:', teamName);
    // TODO: Navigate to main app
  };

  const handleInviteLinkSubmit = (inviteLink: string) => {
    console.log('Invite link submitted:', inviteLink);
    // TODO: Navigate to main app
  };

  const renderStep = () => {
    switch (step) {
      case 'login':
        return <LoginStep onKakaoLogin={handleKakaoLogin} onGoogleLogin={handleGoogleLogin} />;
      case 'nickname':
        return (
          <NicknameStep
            nickname={nickname}
            onNicknameChange={setNickname}
            onSubmit={handleNicknameSubmit}
          />
        );
      case 'team':
        return <TeamStep onSubmit={handleTeamSubmit} />;
      case 'team-name':
        return <TeamNameStep onSubmit={handleTeamNameSubmit} />;
      case 'invite-link':
        return <InviteLinkStep onSubmit={handleInviteLinkSubmit} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen">
      {/* 좌측: 이미지 영역 (데스크톱만 표시) */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-[#F9F8F5] overflow-hidden">
        <img
          src={images.signinImage}
          alt="Signin background"
          className="max-h-screen w-auto object-contain"
          loading="lazy"
        />
      </div>

      {/* 우측: 로그인 패널 */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center px-8 bg-white">
        {renderStep()}
      </div>
    </div>
  );
}
