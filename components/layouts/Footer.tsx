"use client";

import Link from "next/link";
import branding from "@/config/branding.json";
import FadeIn from "@/components/ui/FadeIn";
import {
  Building2,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Globe,
  ArrowRight,
  Twitter,
  Youtube,
} from "lucide-react";
import { ReactNode } from "react";

// 1. Type Definition
interface SocialPlatform {
  url: string;
  username?: string;
  label?: string;
}

interface BrandingConfig {
  brand: {
    description: string;
    email: string;
    phone: string;
  };
  socials: Record<string, SocialPlatform>;
}

const config = branding as BrandingConfig;

export default function Footer() {
  const socialIcons: Record<string, ReactNode> = {
    instagram: <Instagram className="w-5 h-5" />,
    facebook: <Facebook className="w-5 h-5" />,
    twitter: <Twitter className="w-5 h-5" />,
    youtube: <Youtube className="w-5 h-5" />,
    tiktok: <Globe className="w-5 h-5" />,
    whatsapp: <Phone className="w-5 h-5" />,
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 font-sans relative overflow-hidden border-t border-slate-800">
      
      {/* Dekorasi Background */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* --- BAGIAN ATAS (GRID 4 KOLOM) --- */}
        {/* Bagian ini tetap pakai FadeIn agar smooth saat scroll */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* KOLOM 1: BRAND INFO */}
          <FadeIn delay={0}>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-900/50">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="font-extrabold text-xl text-white leading-none tracking-tight">
                        Pusat Bisnis
                    </h3>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1.5">
                        UIN Raden Fatah
                    </p>
                </div>
              </div>
              
              <p className="text-slate-400 text-sm leading-relaxed">
                {config.brand.description}
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3 text-sm text-slate-400 group hover:text-white transition-colors cursor-default">
                    <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span className="leading-relaxed">
                        Jl. Prof. K.H. Zainal Abidin Fikri KM. 3,5, <br />
                        Palembang, Sumatera Selatan 30126
                    </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400 group hover:text-white transition-colors cursor-pointer">
                    <Mail className="w-5 h-5 text-blue-500 shrink-0 group-hover:scale-110 transition-transform" />
                    <span>{config.brand.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400 group hover:text-white transition-colors cursor-pointer">
                    <Phone className="w-5 h-5 text-blue-500 shrink-0 group-hover:scale-110 transition-transform" />
                    <span>{config.brand.phone}</span>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* KOLOM 2: NAVIGASI MENU */}
          <FadeIn delay={0.1}>
            <h4 className="font-bold text-white mb-6 text-lg">Menu Utama</h4>
            <ul className="space-y-3">
              {[
                { label: "Beranda", href: "/" },
                { label: "Daftar Layanan", href: "/services" },
                { label: "Artikel & Berita", href: "/blog" },
                { label: "Tentang Kami", href: "/about" },
                { label: "Promo Spesial", href: "/promo" },
              ].map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href}
                    className="text-slate-400 text-sm hover:text-blue-400 hover:pl-2 transition-all flex items-center gap-2 group w-fit"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FadeIn>

          {/* KOLOM 3: BANTUAN */}
          <FadeIn delay={0.2}>
            <h4 className="font-bold text-white mb-6 text-lg">Bantuan</h4>
            <ul className="space-y-3">
              {[
                { label: "Cara Booking", href: "/help/booking" },
                { label: "Metode Pembayaran", href: "/help/payment" },
                { label: "Syarat & Ketentuan", href: "/terms" },
                { label: "Kebijakan Privasi", href: "/privacy" },
                { label: "FAQ", href: "/faq" },
              ].map((link) => (
                <li key={link.label}>
                  <Link 
                    href={link.href} 
                    className="text-slate-400 text-sm hover:text-blue-400 hover:pl-2 transition-all flex items-center gap-2 group w-fit"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FadeIn>

          {/* KOLOM 4: LOKASI (MAPS) */}
          <FadeIn delay={0.3}>
            <h4 className="font-bold text-white mb-6 text-lg">Lokasi Kami</h4>
            <div className="rounded-xl overflow-hidden border border-slate-700 shadow-lg h-48 w-full bg-slate-800 relative group">
                <iframe 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    title="Lokasi UIN Raden Fatah"
                    className="w-full h-full filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition duration-500"
                    scrolling="no" 
                    src="https://maps.google.com/maps?q=UIN%20Raden%20Fatah%20Palembang&t=&z=15&ie=UTF8&iwloc=&output=embed"
                ></iframe>
                
                <a 
                    href="https://maps.app.goo.gl/uinradenfatah" 
                    target="_blank"
                    className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm hover:bg-blue-600 transition border border-slate-700 flex items-center gap-1"
                >
                    Buka Peta <ArrowRight className="w-3 h-3"/>
                </a>
            </div>
          </FadeIn>

        </div>

        {/* --- BAGIAN BAWAH (COPYRIGHT & SOSMED) --- */}
        {/* PERBAIKAN: Ganti FadeIn dengan DIV biasa + CSS Animation (animate-in) */}
        {/* Ini menjamin footer bawah SELALU muncul meski belum discroll mentok */}
        <div className="border-t border-slate-800 py-8 flex flex-col-reverse md:flex-row justify-between items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            
            {/* Copyright */}
            <p className="text-xs text-slate-500 text-center md:text-left font-medium">
                © {new Date().getFullYear()} <strong className="text-slate-300">UPT Pusat Pengembangan Bisnis</strong> UIN Raden Fatah Palembang. <br className="hidden md:block"/> All rights reserved.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
                {Object.entries(config.socials).map(([key, social]) => (
                    <a 
                        key={key}
                        href={social.url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-blue-500/30 hover:-translate-y-1"
                        title={social.username || social.label}
                    >
                        {socialIcons[key] || <Globe className="w-4 h-4"/>}
                    </a>
                ))}
            </div>
        </div>

      </div>
    </footer>
  );
}