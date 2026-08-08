import type { ReactNode } from "react";
import { PageHeader } from "@/components/ManuscriptOrnaments";

interface LegalPageProps {
  title: string;
  subtitle: string;
  glyph?: string;
  children: ReactNode;
}

const LegalPage = ({ title, subtitle, glyph = "❁", children }: LegalPageProps) => (
  <div className="container-page max-w-4xl">
    <PageHeader title={title} glyph={glyph} subtitle={subtitle} />
    <article className="manuscript-panel p-5 sm:p-8 md:p-10 text-sm sm:text-[15px] leading-relaxed text-muted-foreground space-y-7">
      {children}
    </article>
  </div>
);

export default LegalPage;
