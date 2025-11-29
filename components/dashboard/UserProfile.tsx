"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
  Loader2,
  User,
  Phone,
  Mail,
  ShieldCheck,
  ShieldAlert,
  Camera,
  LogOut,
  Frown, // Icon Sedih
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import EmailVerificationDialog from "@/components/auth/EmailVerificationDialog";

// Helper Initials
const getInitials = (name: string, email: string) => {
  if (name && name.trim().length > 0) {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
  return email.substring(0, 2).toUpperCase();
};

export default function UserProfile() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // State Dialog Logout

  // Data User
  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [displayInitials, setDisplayInitials] = useState("U");

  useEffect(() => {
    setDisplayInitials(getInitials(fullName, email));
  }, [fullName, email]);

  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      setUserId(user.id);
      setEmail(user.email || "");
      setAvatarUrl(user.user_metadata?.avatar_url || "");

      const isGoogleUser = user.app_metadata.provider === "google";
      const isCustomVerified =
        user.user_metadata?.email_verified_custom === true;
      setIsVerified(isGoogleUser || isCustomVerified);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        const finalName =
          profile.full_name || user.user_metadata?.full_name || "";
        setFullName(finalName);
        setPhone(profile.phone_number || "");
      }

      setLoading(false);
    };

    getProfile();
  }, [supabase, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone_number: phone,
        })
        .eq("id", userId);

      if (profileError) throw profileError;

      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      });

      if (authError) throw authError;

      toast.success("Profil berhasil diperbarui!");
      router.refresh();
    } catch (error: unknown) {
      let message = "Terjadi kesalahan saat menyimpan data.";
      if (error instanceof Error) message = error.message;
      toast.error("Gagal menyimpan profil", { description: message });
    } finally {
      setSaving(false);
    }
  };

  const handleVerificationSuccess = () => {
    setIsVerified(true);
    router.refresh();
  };

  // --- LOGIC LOGOUT ---
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/"); // Redirect ke Home
    router.refresh();
    toast.info("Anda telah keluar. Sampai jumpa lagi! 👋");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-gray-500 text-sm">Memuat data profil...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* 1. Dialog Verifikasi Email */}
      <EmailVerificationDialog
        open={showVerification}
        onOpenChange={setShowVerification}
        email={email}
        onSuccess={handleVerificationSuccess}
      />

      {/* 2. Dialog Logout (Validasi Sedih) */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="sm:max-w-sm text-center p-6">
          <div className="mx-auto bg-slate-100 p-4 rounded-full mb-2">
            <Frown className="w-10 h-10 text-slate-500" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              Yakin mau pergi?
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              Kami sedih melihat Anda pergi. Anda mungkin akan melewatkan promo
              menarik jika keluar sekarang. 🥺
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-4">
            {/* Tombol Batal lebih menonjol (Primary) */}
            <Button
              onClick={() => setShowLogoutConfirm(false)}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Gajadi deh, tetap disini
            </Button>
            {/* Tombol Keluar dibuat ghost/secondary agar tidak terlalu 'mengundang' */}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              Tetap Keluar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col md:flex-row gap-8">
        {/* KOLOM KIRI: AVATAR & STATUS */}
        <div className="md:w-1/3 space-y-6">
          <Card className="overflow-hidden border-blue-100 shadow-sm">
            <div className="h-24 bg-gradient-to-r from-blue-600 to-blue-400 relative"></div>
            <div className="px-6 pb-6 relative">
              <div className="relative -mt-12 mb-4 w-fit mx-auto md:mx-0">
                <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-bold">
                    {displayInitials}
                  </AvatarFallback>
                </Avatar>
                <button
                  className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full border shadow-sm hover:bg-gray-100 transition"
                  title="Ganti Foto"
                >
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div className="text-center md:text-left mb-4">
                <h2 className="font-bold text-xl text-gray-900">
                  {fullName || "Pengguna"}
                </h2>
                <p className="text-sm text-gray-500 truncate">{email}</p>
              </div>

              <div
                className={`p-4 rounded-xl border ${
                  isVerified
                    ? "bg-green-50 border-green-100"
                    : "bg-amber-50 border-amber-100"
                }`}
              >
                <div className="flex items-start gap-3">
                  {isVerified ? (
                    <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5" />
                  )}
                  <div>
                    <p
                      className={`text-sm font-bold ${
                        isVerified ? "text-green-700" : "text-amber-700"
                      }`}
                    >
                      {isVerified
                        ? "Akun Terverifikasi"
                        : "Belum Terverifikasi"}
                    </p>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {isVerified
                        ? "Email Anda sudah terhubung dan aman."
                        : "Verifikasi email diperlukan untuk melakukan booking."}
                    </p>
                    {!isVerified && (
                      <Button
                        onClick={() => setShowVerification(true)}
                        size="sm"
                        className="mt-3 w-full bg-amber-600 hover:bg-amber-700 text-white border-none h-8 text-xs"
                      >
                        Verifikasi Sekarang
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* TOMBOL LOGOUT (Mobile Only - Optional, tapi bagus ada di sini juga) */}
          <div className="md:hidden">
            <Button
              variant="outline"
              className="w-full text-red-500 border-red-100 hover:bg-red-50"
              onClick={() => setShowLogoutConfirm(true)}
            >
              <LogOut className="w-4 h-4 mr-2" /> Keluar Aplikasi
            </Button>
          </div>
        </div>

        {/* KOLOM KANAN: FORM EDIT */}
        <div className="md:w-2/3 space-y-6">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>Informasi Pribadi</CardTitle>
              <CardDescription>
                Perbarui data diri Anda untuk kemudahan administrasi.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-gray-700">Email Terdaftar</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <Input
                      value={email}
                      disabled
                      className="pl-10 bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed"
                    />
                    {isVerified && (
                      <ShieldCheck className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Hubungi admin jika ingin mengubah email utama.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Nama Lengkap</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Nama sesuai KTP"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">Nomor WhatsApp / HP</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Contoh: 081234567890"
                      type="tel"
                    />
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Nomor ini akan dihubungi untuk konfirmasi pesanan mendesak.
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 px-6"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Menyimpan...
                      </>
                    ) : (
                      "Simpan Perubahan"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* CARD LOGOUT (DESKTOP) */}
          <Card className="border-red-100 bg-red-50/30 shadow-none">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Sesi Login</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Keluar dari akun Anda di perangkat ini.
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowLogoutConfirm(true)} // Trigger Dialog
                className="bg-white text-red-600 border border-red-200 hover:bg-red-600 hover:text-white shadow-sm"
              >
                <LogOut className="w-4 h-4 mr-2" /> Keluar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
