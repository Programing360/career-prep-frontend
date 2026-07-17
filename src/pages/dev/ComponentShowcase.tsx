import { useState } from 'react';
import { Mail, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { OtpInput } from '@/components/ui/OtpInput';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';
import { Radio } from '@/components/ui/Radio';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Switch } from '@/components/ui/Switch';
import { Select } from '@/components/ui/Select';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { FormField } from '@/components/ui/FormField';
import { FormSection } from '@/components/ui/FormSection';
import { Spinner } from '@/components/ui/Spinner';
import { useTheme } from '@/hooks/useTheme';

const fruitOptions = [
  { label: 'Apples', value: 'apples' },
  { label: 'Bananas', value: 'bananas' },
  { label: 'Cherries', value: 'cherries' },
  { label: 'Dates', value: 'dates' },
  { label: 'Elderberries', value: 'elderberries' },
];

const countryOptions = [
  { label: 'Pakistan', value: 'pk' },
  { label: 'India', value: 'in' },
  { label: 'United States', value: 'us' },
  { label: 'United Kingdom', value: 'uk' },
];

export default function ComponentShowcase() {
  const { theme, toggleTheme } = useTheme();
  const [otp, setOtp] = useState('');
  const [radioValue, setRadioValue] = useState('option1');
  const [multiSelectValue, setMultiSelectValue] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] p-8">
      <div className="mx-auto max-w-4xl space-y-12">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-heading text-[rgb(var(--color-text-primary))]">
            Component Showcase
          </h1>
          <div className="flex items-center gap-3">
            <Switch
              checked={theme === 'dark'}
              onChange={toggleTheme}
              label="Dark mode"
            />
          </div>
        </div>

        {/* Buttons */}
        <FormSection
          title="Buttons"
          description="All variants, sizes, and states"
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link Button</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" size="sm">
                Small
              </Button>
              <Button variant="primary" size="md">
                Medium
              </Button>
              <Button variant="primary" size="lg">
                Large
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" isLoading>
                Loading
              </Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
              <Button variant="primary" fullWidth>
                Full Width
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" leftIcon={<Mail size={16} />}>
                With Left Icon
              </Button>
              <Button variant="outline" rightIcon={<Search size={16} />}>
                With Right Icon
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <IconButton icon={<Mail size={18} />} aria-label="Send email" />
              <IconButton
                icon={<Search size={18} />}
                variant="outline"
                aria-label="Search"
              />
              <IconButton
                icon={<User size={18} />}
                variant="primary"
                aria-label="User"
              />
              <IconButton
                icon={<Mail size={18} />}
                isLoading
                aria-label="Loading"
              />
            </div>
          </div>
        </FormSection>

        {/* Inputs */}
        <FormSection
          title="Inputs"
          description="Text, email, search, with icons, errors, hints"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail size={16} />}
            />
            <PasswordInput label="Password" placeholder="Enter password" />
            <Input
              label="Search"
              type="search"
              placeholder="Search..."
              leftIcon={<Search size={16} />}
              hint="Press Enter to search"
            />
            <Input
              label="Email with error"
              type="email"
              error="Please enter a valid email address"
              defaultValue="invalid@"
            />
            <Input label="Read-only" readOnly value="Read only value" />
            <Input label="Disabled" disabled value="Disabled value" />
          </div>
          <Textarea
            label="Message"
            placeholder="Write your message here..."
            rows={4}
            hint="Maximum 500 characters"
          />
          <Textarea
            label="Message with error"
            placeholder="Write your message here..."
            error="Message is too short. Please provide more detail."
          />
        </FormSection>

        {/* OTP */}
        <FormSection title="OTP Input" description="One-time password entry">
          <OtpInput
            length={6}
            value={otp}
            onChange={setOtp}
            label="Enter verification code"
          />
          <OtpInput
            length={4}
            value=""
            onChange={() => {}}
            label="Short OTP"
            error="Invalid code"
          />
        </FormSection>

        {/* Selection Controls */}
        <FormSection
          title="Selection Controls"
          description="Checkboxes, radios, switches, and selects"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <p className="text-sm font-medium text-secondary-500">
                Checkboxes
              </p>
              <Checkbox label="Accept terms and conditions" defaultChecked />
              <Checkbox label="Indeterminate state" indeterminate />
              <Checkbox label="Disabled checkbox" disabled />
              <Checkbox label="Disabled checked" disabled defaultChecked />
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium text-secondary-500">
                Radio Group
              </p>
              <RadioGroup
                name="showcase-radio"
                options={countryOptions}
                value={radioValue}
                onChange={setRadioValue}
              />
              <Radio disabled label="Disabled radio" />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-secondary-500">Switches</p>
            <div className="flex flex-wrap items-center gap-6">
              <Switch label="Notifications" />
              <Switch
                label="Dark mode"
                checked={theme === 'dark'}
                onChange={toggleTheme}
              />
              <Switch label="Disabled" disabled />
              <Switch label="Disabled on" disabled checked />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Country"
              options={countryOptions}
              placeholder="Select a country"
            />
            <MultiSelect
              label="Fruits"
              options={fruitOptions}
              value={multiSelectValue}
              onChange={setMultiSelectValue}
              placeholder="Pick fruits"
            />
          </div>
        </FormSection>

        {/* FormField with Glass */}
        <FormSection
          title="Form Field (Glass Card)"
          description="Fields wrapped in the glass card variant"
        >
          <div className="space-y-4">
            <FormField glass label="Full Name" required>
              <Input
                placeholder="Enter your full name"
                leftIcon={<User size={16} />}
              />
            </FormField>
            <FormField glass label="Email" error="Please enter a valid email">
              <Input
                type="email"
                placeholder="you@example.com"
                leftIcon={<Mail size={16} />}
              />
            </FormField>
            <FormField glass label="Password" hint="At least 8 characters">
              <PasswordInput placeholder="Enter password" />
            </FormField>
          </div>
        </FormSection>

        {/* Spinner */}
        <FormSection title="Spinner" description="Loading indicator">
          <div className="flex items-center gap-4">
            <Spinner size={16} />
            <Spinner size={20} />
            <Spinner size={24} />
          </div>
        </FormSection>
      </div>
    </div>
  );
}
