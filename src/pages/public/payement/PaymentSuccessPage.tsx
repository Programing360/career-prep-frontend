import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // পেমেন্ট সফল হওয়ার পর ৩ সেকেন্ডের মধ্যে প্রোফাইল বা ড্যাশবোর্ডে পাঠাবে
    const timer = setTimeout(() => {
      navigate('/dashboard');
      // প্রয়োজনে ইউজার ডেটা রিফ্রেস করার কাস্টম ফাংশন কল করুন
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mb-4">
        ✓
      </div>
      <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
      <p className="text-gray-600 mb-6">
        Thank you for upgrading to Premium. Your account has been updated!
      </p>
      <p className="text-sm text-gray-400">Redirecting to Dashboard...</p>
    </div>
  );
};
