import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Estoque+ | Controle de Estoque",
    description: "Sistema web de controle de estoque para comércio",
    icons: {
        icon: "/favicon.png",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>{children}</body>
        </html>
    );
}
