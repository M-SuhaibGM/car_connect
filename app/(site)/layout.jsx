

import Navbar from "./components/Navbar";

export default function Layout({ children }) {
    return (
        <html lang="en">
            <body
                className={`antialiased`}
            >

                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    {children}
                </div>

            </body>
        </html>
    );
}
