import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import BrandMark from "./BrandMark";
import { Button } from "./ui/button";

function PageHeader({ onBack, title, subtitle }) {
  return (
    <div className="fd-nav">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <BrandMark />
        {onBack && (
          <Button type="button" variant="secondary" size="sm" onClick={onBack}>
            <ArrowLeft />
            Back
          </Button>
        )}
      </div>
    </div>
  );
}

function PageIntro({ eyebrow, title, subtitle }) {
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {eyebrow && (
        <p className="mb-3 inline-flex items-center rounded-full border border-farm-200 bg-white px-3 py-1 text-xs font-semibold text-farm-700">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-extrabold tracking-tight text-farm-900 md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 max-w-xl text-stone-500">{subtitle}</p>
      )}
    </motion.div>
  );
}

export { PageHeader, PageIntro };
