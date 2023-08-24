import FooterMain from "@/components/page/main-app/footer";
import HeaderMain from "@/components/page/main-app/header";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
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
      <FooterMain />
    </main>
  )
}