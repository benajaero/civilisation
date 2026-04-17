import { shellClasses } from "@civilisation/brand";

export function SiteFrame({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return <div className={shellClasses.pageFrame}>{children}</div>;
}
