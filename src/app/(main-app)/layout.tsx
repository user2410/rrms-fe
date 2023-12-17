import FooterMain from "./_components/footer";
import HeaderMain from "./_components/header";
import { Fragment } from "react";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Fragment>
      <main
        className="relative min-h-screen"
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <HeaderMain />
        <div className="pt-28">
          {children}
        </div>
      </main>
      <FooterMain />
    </Fragment>
  );
}
