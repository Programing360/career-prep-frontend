import { forwardRef, useState, type ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from './Input';
import type { InputProps } from './Input';

export const PasswordInput = forwardRef<
  HTMLInputElement,
  Omit<InputProps, 'type'>
>((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleIcon: ReactNode = showPassword ? (
    <EyeOff size={16} />
  ) : (
    <Eye size={16} />
  );

  return (
    <Input
      ref={ref}
      type={showPassword ? 'text' : 'password'}
      rightIcon={
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword((prev) => !prev)}
          className="pointer-events-auto cursor-pointer text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300"
        >
          {toggleIcon}
        </button>
      }
      {...props}
    />
  );
});

PasswordInput.displayName = 'PasswordInput';
