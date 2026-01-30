'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

interface TooltipStep {
  id: string;
  target: string; // CSS selector
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface OnboardingContextValue {
  isActive: boolean;
  currentStep: number;
  steps: TooltipStep[];
  startOnboarding: (steps: TooltipStep[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipOnboarding: () => void;
  completeOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

const ONBOARDING_KEY = 'gold-price-onboarding-completed';

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<TooltipStep[]>([]);

  const startOnboarding = useCallback((newSteps: TooltipStep[]) => {
    // Check if already completed
    if (typeof window !== 'undefined') {
      const completed = localStorage.getItem(ONBOARDING_KEY);
      if (completed) return;
    }
    setSteps(newSteps);
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeOnboarding();
    }
  }, [currentStep, steps.length]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const skipOnboarding = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    if (typeof window !== 'undefined') {
      localStorage.setItem(ONBOARDING_KEY, 'true');
    }
  }, []);

  const completeOnboarding = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    if (typeof window !== 'undefined') {
      localStorage.setItem(ONBOARDING_KEY, 'true');
    }
  }, []);

  return (
    <OnboardingContext.Provider
      value={{
        isActive,
        currentStep,
        steps,
        startOnboarding,
        nextStep,
        prevStep,
        skipOnboarding,
        completeOnboarding,
      }}
    >
      {children}
      {isActive && <OnboardingOverlay />}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}

function OnboardingOverlay() {
  const { steps, currentStep, nextStep, prevStep, skipOnboarding } = useOnboarding();
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({});

  const step = steps[currentStep];

  useEffect(() => {
    if (!step) return;

    const targetElement = document.querySelector(step.target);
    if (!targetElement) {
      // If target not found, skip to next
      nextStep();
      return;
    }

    const rect = targetElement.getBoundingClientRect();
    const position = step.position || 'bottom';
    const tooltipWidth = 300;
    const tooltipHeight = 150;
    const offset = 12;

    let style: React.CSSProperties = {};
    let arrow: React.CSSProperties = {};

    switch (position) {
      case 'bottom':
        style = {
          top: rect.bottom + offset,
          left: Math.max(10, rect.left + rect.width / 2 - tooltipWidth / 2),
        };
        arrow = {
          top: -6,
          left: '50%',
          transform: 'translateX(-50%) rotate(45deg)',
        };
        break;
      case 'top':
        style = {
          top: rect.top - tooltipHeight - offset,
          left: Math.max(10, rect.left + rect.width / 2 - tooltipWidth / 2),
        };
        arrow = {
          bottom: -6,
          left: '50%',
          transform: 'translateX(-50%) rotate(45deg)',
        };
        break;
      case 'left':
        style = {
          top: rect.top + rect.height / 2 - tooltipHeight / 2,
          left: rect.left - tooltipWidth - offset,
        };
        arrow = {
          right: -6,
          top: '50%',
          transform: 'translateY(-50%) rotate(45deg)',
        };
        break;
      case 'right':
        style = {
          top: rect.top + rect.height / 2 - tooltipHeight / 2,
          left: rect.right + offset,
        };
        arrow = {
          left: -6,
          top: '50%',
          transform: 'translateY(-50%) rotate(45deg)',
        };
        break;
    }

    // Ensure tooltip stays in viewport
    style.left = Math.max(10, Math.min(window.innerWidth - tooltipWidth - 10, style.left as number));

    setTooltipStyle(style);
    setArrowStyle(arrow);

    // Highlight target element
    targetElement.classList.add('onboarding-highlight');

    return () => {
      targetElement.classList.remove('onboarding-highlight');
    };
  }, [step, nextStep]);

  if (!step) return null;

  return (
    <>
      {/* Overlay backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[998]"
        onClick={skipOnboarding}
      />

      {/* Tooltip */}
      <Card
        className="fixed z-[999] w-[300px] shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-300"
        style={tooltipStyle}
      >
        {/* Arrow */}
        <div
          className="absolute w-3 h-3 bg-card border-l border-t border-border"
          style={arrowStyle}
        />

        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm">{step.title}</h4>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 -mr-2 -mt-2"
              onClick={skipOnboarding}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <p className="text-sm text-muted-foreground mb-4">{step.content}</p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {currentStep + 1} / {steps.length}
            </span>
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="ghost" size="sm" onClick={prevStep}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Trước
                </Button>
              )}
              <Button size="sm" onClick={nextStep}>
                {currentStep === steps.length - 1 ? 'Hoàn tất' : 'Tiếp'}
                {currentStep < steps.length - 1 && (
                  <ChevronRight className="h-4 w-4 ml-1" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Styles for highlight */}
      <style jsx global>{`
        .onboarding-highlight {
          position: relative;
          z-index: 999 !important;
          box-shadow: 0 0 0 4px var(--primary), 0 0 0 8px rgba(var(--primary), 0.2);
          border-radius: 8px;
        }
      `}</style>
    </>
  );
}

// Predefined onboarding steps for the app
export const dashboardOnboardingSteps: TooltipStep[] = [
  {
    id: 'price-grid',
    target: '[data-onboarding="price-grid"]',
    title: 'Bảng giá vàng',
    content: 'Đây là bảng giá vàng real-time từ các nhà cung cấp. Giá được cập nhật tự động khi có thay đổi.',
    position: 'top',
  },
  {
    id: 'compare-link',
    target: '[data-onboarding="compare-link"]',
    title: 'So sánh giá',
    content: 'Nhấn vào đây để so sánh giá vàng giữa các nhà cung cấp và xem biểu đồ lịch sử.',
    position: 'bottom',
  },
  {
    id: 'theme-toggle',
    target: '[data-onboarding="theme-toggle"]',
    title: 'Đổi giao diện',
    content: 'Click để chuyển giữa chế độ sáng và tối theo sở thích của bạn.',
    position: 'bottom',
  },
];
