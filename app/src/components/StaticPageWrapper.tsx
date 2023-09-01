import { ReactNode } from "react";

export function StaticPageWrapper({
  children,
  pageTitle,
  description,
}: {
  children: ReactNode;
  pageTitle: string;
  description?: string;
}) {
  return (
    <div className="h-full p-6 py-10">
      <div className="max-w-4xl mx-auto w-full grid gap-5 content-start">
        <header className="grid gap-2">
          <h1 className="text-5xl">{pageTitle}</h1>
          {description ? (
            <p className="text-xl text-neutral-400 max-w-2xl">{description}</p>
          ) : null}
        </header>
        {children}
      </div>
    </div>
  );
}
