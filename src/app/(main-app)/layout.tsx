import FooterMain from "@/components/page/main-app/footer"
import HeaderMain from "@/components/page/main-app/header"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <main
        className="relative flex-grow"
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <HeaderMain />
        <div className="pt-20">
          {children}
        </div>
        <FooterMain/>
      </main>
    </div>
  )
}