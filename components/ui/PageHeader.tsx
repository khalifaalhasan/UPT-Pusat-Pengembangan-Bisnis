"use client";

import FadeIn from "@/components/ui/FadeIn";

interface PageHeaderProps {
  title: string;
  description: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="bg-slate-50 border-b border-slate-200 py-16 md:py-24">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {title}
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            {description}
            </p>
        </FadeIn>
      </div>
    </div>
  );
}