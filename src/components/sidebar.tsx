"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ArrowLeftRight,
    Users,
    FileText,
    Shield,
    LogOut,
} from "lucide-react";

const allLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, gerenteOnly: false },
    { href: "/produtos", label: "Produtos", icon: Package, gerenteOnly: false },
    { href: "/movimentacoes", label: "Movimentações", icon: ArrowLeftRight, gerenteOnly: false },
    { href: "/usuarios", label: "Usuários", icon: Users, gerenteOnly: true },
    { href: "/relatorios", label: "Relatórios", icon: FileText, gerenteOnly: false },
    { href: "/auditoria", label: "Auditoria", icon: Shield, gerenteOnly: true },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [nomeUsuario, setNomeUsuario] = useState("");
    const [userRole, setUserRole] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const dados = localStorage.getItem("usuario");
        if (dados) {
            const usuario = JSON.parse(dados);
            setNomeUsuario(usuario.nome || "");
            setUserRole(usuario.role || "");
        }
        setMounted(true);
    }, []);

    function handleLogout() {
        localStorage.removeItem("usuario");
        router.push("/login");
    }

    const isGerente = userRole === "ADMIN";
    const links = mounted ? allLinks.filter((link) => !link.gerenteOnly || isGerente) : allLinks;

    return (
        <aside className="w-60 bg-gray-900 text-white flex flex-col min-h-screen fixed left-0 top-0">
            {/* Logo */}
            <div className="flex items-center justify-center px-5 py-4 border-b border-gray-800">
                <Image
                    src="/logo.jpg"
                    alt="Estoque+"
                    width={140}
                    height={140}
                    className="rounded"
                />
            </div>

            {/* Navegação */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {links.map((link) => {
                    const isActive =
                        link.href === "/dashboard"
                            ? pathname === "/dashboard"
                            : pathname.startsWith(link.href);
                    const Icon = link.icon;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                ${isActive
                                    ? "bg-primary-600 text-white"
                                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                }`}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Rodapé com usuário */}
            <div className="px-3 py-4 border-t border-gray-800 space-y-2">
                {nomeUsuario && (
                    <p className="px-3 text-xs text-gray-400 truncate">{nomeUsuario}</p>
                )}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm text-gray-400 
            hover:bg-gray-800 hover:text-white transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Sair
                </button>
            </div>
        </aside>
    );
}
