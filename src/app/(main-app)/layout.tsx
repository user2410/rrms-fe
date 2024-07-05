import { FavListingsProvider } from "@/context/favorite_listings.context";
import FooterMain from "./_components/footer";
import HeaderMain from "./_components/header";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FavListingsProvider>
      <main
        className="bg-muted"
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
    </FavListingsProvider>
  );
}
