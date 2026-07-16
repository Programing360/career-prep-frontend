import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ShieldCheck, Zap, ArrowLeft } from 'lucide-react';
import { useAuth } from './AuthContext';

const OTP_LENGTH = 6;

export default function OtpVerification() {
  const { verifyOtp, user } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!phone || phone.length < 10) {
      setError('Enter a valid phone number');
      return;
    }
    setStep('otp');
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    const newOtp = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    otpRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = async () => {
    setError('');
    const otpString = otp.join('');
    if (otpString.length !== OTP_LENGTH) {
      setError('Enter the complete 6-digit code');
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(phone, otpString);
      if (user?.onboardingCompleted) navigate('/dashboard/overview');
      else navigate('/onboarding');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-secondary text-xl">PrepMaster<span className="text-primary">AI</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-secondary">
            {step === 'phone' ? 'Verify your phone' : 'Enter verification code'}
          </h1>
          <p className="text-secondary/60 mt-2 text-sm">
            {step === 'phone'
              ? 'We\'ll send you a one-time code via SMS'
              : `Code sent to +92 ${phone}`}
          </p>
        </div>

        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          {error && (
            <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm">
              {error}
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">Phone Number</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-sm text-secondary/60 font-medium">
                    <span>+92</span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="3001234567"
                    className="w-full pl-14 pr-4 py-2.5 border border-border/50 rounded-xl text-sm text-secondary placeholder-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors bg-secondary/5"
                  />
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                </div>
                <p className="mt-2 text-xs text-secondary/50">Enter your 10-digit Pakistani mobile number</p>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-hover transition-colors shadow-sm"
              >
                Send Verification Code
              </button>
              <p className="text-center text-xs text-secondary/50">
                Use OTP <span className="font-mono font-semibold text-secondary/70">123456</span> for demo
              </p>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="flex justify-center gap-2.5">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    onPaste={handleOtpPaste}
                    className="w-12 h-14 text-center text-xl font-bold border border-border/50 rounded-xl text-secondary bg-secondary/5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                  />
                ))}
              </div>

              <button
                onClick={handleVerify}
                disabled={loading || otp.join('').length !== OTP_LENGTH}
                className="w-full py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 shadow-sm flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>

              <div className="text-center space-y-2">
                <button
                  onClick={() => { setStep('phone'); setOtp(Array(OTP_LENGTH).fill('')); setError(''); }}
                  className="text-sm text-secondary/60 hover:text-secondary inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Change number
                </button>
                <p className="text-xs text-secondary/50">
                  Didn't receive the code?{' '}
                  <button className="text-primary hover:text-primary-hover font-medium">Resend</button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Link(props: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to?: string; children: React.ReactNode }) {
  return <a href={props.to || '#'} {...props}>{props.children}</a>;
}
