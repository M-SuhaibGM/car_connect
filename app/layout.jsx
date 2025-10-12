
import "./globals.css";
import { Toaster } from "sonner";
import SessionWrapper from "@/components/ui/SessionWrapper";


export const metadata = {
  title: "NexaRent",
  description: "Rent Your Dream Car in Pakistan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <SessionWrapper>
          {children}
          <Toaster />
        </SessionWrapper>
      </body>
    </html>
  );
}
