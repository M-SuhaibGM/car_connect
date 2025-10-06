
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";


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
        <div className="flex flex-col min-h-screen">
          <Navbar />
          {children}
          <Toaster />
        </div>
      </body>
    </html>
  );
}
