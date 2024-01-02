import Logo from "@/components/ui/logo";
import { Separator } from "@/components/ui/separator";

export default function FooterMain() {
  return (
    <footer className="bg-slate-100 py-4 border-t">
      <div className="container space-y-4">
        <div className="sm:flex sm:items-center sm:justify-between space-y-4">
          <Logo size={40} />
          <ul className="flex flex-wrap items-center space-x-4 md:space-x-6 text-sm font-medium">
            <li>
              <a href="#" className="text-foreground/60 hover:text-primary">
                About
              </a>
            </li>
            <li>
              <a href="#" className="text-foreground/60 hover:text-primary">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-foreground/60 hover:text-primary">
                Licensing
              </a>
            </li>
            <li>
              <a href="#" className="text-foreground/60 hover:text-foreground/80">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <Separator />
        <span className="block text-sm text-muted-foreground sm:text-center ">
          © 2023{" "}
          <a href="https://flowbite.com/" className="hover:underline">
            RRMS™
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}
