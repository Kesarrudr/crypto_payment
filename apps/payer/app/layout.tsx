import AppWalletProvider from "./context/AppWalletProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AppWalletProvider>{children}</AppWalletProvider>
    </html>
  );
}
