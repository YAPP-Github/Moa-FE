import { useStepContext } from './MultiStepForm';

/**
 * Multi-step form 네비게이션을 위한 hook
 *
 * MultiStepForm 내부에서 Step 상태 및 네비게이션 함수에 접근합니다.
 *
 * @returns Step 상태 및 네비게이션 함수
 * @throws MultiStepForm 외부에서 사용 시 에러
 *
 * @example
 * ```tsx
 * function StepNavigation() {
 *   const {
 *     currentStep,
 *     totalSteps,
 *     isFirstStep,
 *     isLastStep,
 *     goToNextStep,
 *     goToPrevStep,
 *   } = useMultiStepForm();
 *
 *   const handleNext = async () => {
 *     const success = await goToNextStep();
 *     if (!success) {
 *       // 검증 실패 - 에러 표시됨
 *     }
 *   };
 *
 *   return (
 *     <div className="flex justify-between">
 *       <button
 *         type="button"
 *         onClick={goToPrevStep}
 *         disabled={isFirstStep}
 *       >
 *         이전
 *       </button>
 *       <span>{currentStep + 1} / {totalSteps}</span>
 *       {isLastStep ? (
 *         <button type="submit">완료</button>
 *       ) : (
 *         <button type="button" onClick={handleNext}>
 *           다음
 *         </button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useMultiStepForm() {
  return useStepContext();
}
