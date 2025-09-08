import "../styles/globals.css";
import Navbar from "@/app/components/layout/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* <Navbar /> */}
        <main className="container mx-auto px-4">{children}</main>
      </body>
    </html>
  );
}