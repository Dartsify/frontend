"use client";
export default function Button({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-background border border-border text-foreground font-medium hover:bg-border-2 rounded-lg px-2.5 py-1 transition-background duration-250 leading-5">
      {children || title}
    </div>
  );
}
