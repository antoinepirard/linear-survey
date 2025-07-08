import { AnimationWrapper } from '@/hooks/useAnimation';
import LocationTime from './LocationTime';

export default function HeaderSection() {
  return (
    <AnimationWrapper delay="0ms" className="pt-9">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0">
        <div>
          <h1 className="text-base font-bold text-slate-900">
            Antoine Pirard
          </h1>
          <p className="text-base font-normal text-slate-600">
            Product designer
          </p>
        </div>
        <div className="flex-shrink-0">
          <LocationTime />
        </div>
      </div>
    </AnimationWrapper>
  );
}