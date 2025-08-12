import "./globals.css";

export const metadata = {
  title: "Next.js Todo List",
  description: "A minimal todo list app built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <h1>Todo List</h1>
          </header>
          <main>{children}</main>
          <footer className="footer">Built with Next.js</footer>
        </div>
      </body>
    </html>
  );
}
