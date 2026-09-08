import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Lock, Mail, User, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: (userEmail: string) => void;
  onBypassDemo: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess, onBypassDemo }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // For runtime config if not set in .env
  const [customUrl, setCustomUrl] = useState('');
  const [customKey, setCustomKey] = useState('');
  const [showConfigInput, setShowConfigInput] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      let client = supabase;

      if (!isSupabaseConfigured && customUrl && customKey) {
        // dynamic client creation for test
        const { createClient } = await import('@supabase/supabase-js');
        client = createClient(customUrl, customKey);
      }

      if (!client) {
        setErrorMessage('Supabase 환경 변수(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)가 설정되지 않았습니다. 아래 설정 버튼을 눌러 입력하거나 데모 모드로 체험해보세요.');
        setLoading(false);
        return;
      }

      if (isSignUp) {
        const { data, error } = await client.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        if (data.session) {
          onLoginSuccess(data.user?.email || email);
        } else {
          setSuccessMessage('회원가입 확인 메일이 발송되었습니다! (이메일 인증이 필요할 수 있습니다)');
        }
      } else {
        const { data, error } = await client.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) {
          onLoginSuccess(data.user.email || email);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || '인증 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#fcf8f2] relative overflow-hidden">
      {/* Background doodles */}
      <div className="absolute top-10 left-10 text-4xl animate-bounce">🐿️</div>
      <div className="absolute bottom-10 right-10 text-4xl animate-acorn">🌰</div>
      <div className="absolute top-1/4 right-1/4 text-2xl opacity-60">✨</div>

      <div className="sketch-card w-full max-w-md p-8 bg-[#fffdf9] relative z-10 shadow-xl border-4 border-dashed border-[#8c7355]">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-block bg-[#ffd1dc] text-[#a85555] px-3 py-1 rounded-full text-xs font-bold border border-[#f8b4b4] mb-2 font-jua">
            🔒 사내 인증 시스템 (Supabase)
          </div>
          <h1 className="text-3xl font-extrabold text-[#5c4033] font-jua flex items-center justify-center gap-2">
            <span>🌰</span> 다람쥐 스케치북 로그인
          </h1>
          <p className="text-sm text-[#8c7355] font-jua mt-1">
            인가된 팀원만 로그인하여 일정을 관리할 수 있습니다.
          </p>
        </div>

        {/* Warning if Supabase is not configured */}
        {!isSupabaseConfigured && !showConfigInput && (
          <div className="mb-6 p-4 bg-[#fef3c7] border-2 border-dashed border-[#fde68a] rounded-2xl text-xs text-[#92400e] space-y-2 font-jua">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertCircle size={16} />
              <span>Supabase 연동 안내</span>
            </div>
            <p>
              프로젝트에 Supabase 키가 설정되지 않았습니다. 실제 Supabase 인증을 테스트하려면 키를 입력하거나, 하단의 <strong>체험 모드(데모)</strong>로 바로 시작하실 수 있습니다.
            </p>
            <button
              type="button"
              onClick={() => setShowConfigInput(true)}
              className="text-[#92400e] underline font-bold cursor-pointer hover:text-black"
            >
              ⚙️ Supabase URL & Key 직접 입력하기
            </button>
          </div>
        )}

        {/* Config Input Modal / Section */}
        {showConfigInput && (
          <div className="mb-6 p-4 bg-[#fff5e6] border-2 border-dashed border-[#b59b84] rounded-2xl space-y-3">
            <div className="text-xs font-bold text-[#5c4033]">Supabase 임시 설정</div>
            <input
              type="text"
              placeholder="Supabase Project URL (https://xxx.supabase.co)"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="sketch-input w-full px-3 py-1.5 text-xs font-jua"
            />
            <input
              type="password"
              placeholder="Supabase Anon Public Key"
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
              className="sketch-input w-full px-3 py-1.5 text-xs font-jua"
            />
            <button
              type="button"
              onClick={() => setShowConfigInput(false)}
              className="text-xs text-[#8c7355] underline cursor-pointer"
            >
              닫기
            </button>
          </div>
        )}

        {/* Error or Success message */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-xl text-xs font-jua">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-xl text-xs font-jua">
            {successMessage}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#5c4033] mb-1">이메일 주소</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-[#8c7355]" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="team.member@company.com"
                required
                className="sketch-input w-full pl-9 pr-3 py-2 text-sm font-jua"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5c4033] mb-1">비밀번호</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-[#8c7355]" size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="sketch-input w-full pl-9 pr-3 py-2 text-sm font-jua"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="sketch-button w-full bg-[#ffdac1] hover:bg-[#ffcbb3] text-[#9a5332] py-3 rounded-2xl font-bold text-base flex items-center justify-center gap-2 cursor-pointer shadow-md transition-transform hover:-translate-y-0.5"
          >
            {loading ? (
              <span>처리중... 🌰</span>
            ) : (
              <>
                <Sparkles size={18} />
                {isSignUp ? '회원가입 하기' : '로그인 하기'}
              </>
            )}
          </button>
        </form>

        {/* Toggle Sign up / Sign in */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-[#8c7355] hover:text-[#5c4033] font-jua underline cursor-pointer"
          >
            {isSignUp ? '이미 계정이 있으신가요? 로그인으로 돌아가기' : '계정이 없으신가요? Supabase 회원가입'}
          </button>
        </div>

        {/* Bypass / Demo Mode for instant test */}
        <div className="mt-6 pt-4 border-t-2 border-dashed border-[#d8c4a9] text-center">
          <button
            type="button"
            onClick={onBypassDemo}
            className="sketch-button w-full bg-[#b5ead7] hover:bg-[#a2e3cd] text-[#065f46] py-2.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>🐿️</span>
            데모 체험 모드로 바로 시작하기
            <ArrowRight size={16} />
          </button>
          <p className="text-[11px] text-[#8c7355] mt-1.5 font-gaegu text-base">
            (Supabase 연결 없이 바로 팀 일정 프로그램을 체험할 수 있습니다)
          </p>
        </div>
      </div>
    </div>
  );
};
