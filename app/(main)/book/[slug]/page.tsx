"use client";

import { useState, useEffect, use } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { BookingSkeleton } from "@/components/ui/Skeleton";
import { User } from "@supabase/supabase-js";
import { differenceInDays, differenceInHours } from "date-fns";

// Helper format rupiah
const formatRupiah = (num: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);

export default function BookingProcessPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Unwrap params
  const { slug } = use(params);

  // Ambil tanggal dari URL
  const startDateStr = searchParams.get("start");
  const endDateStr = searchParams.get("end");

  // State Data
  const [service, setService] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // State Form Input (Sesuai Screenshot)
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [guestName, setGuestName] = useState(""); // "Pesan untuk orang lain" logic
  const [isForSelf, setIsForSelf] = useState(true);

  // 1. Fetch Data Service & User
  useEffect(() => {
    const initData = async () => {
      // Cek User
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      // Auto fill jika user login
      if (user) {
        setFullName(user.user_metadata?.full_name || "");
        setEmail(user.email || "");
        setGuestName(user.user_metadata?.full_name || "");
      }

      // Ambil Service Info
      const { data: serviceData } = await supabase
        .from("services")
        .select("*")
        .eq("slug", slug)
        .single();

      setService(serviceData);
      setLoading(false);
    };

    initData();
  }, [slug, supabase]);

  // Handle Checkbox "Pesanan ini untuk saya"
  useEffect(() => {
    if (isForSelf) {
      setGuestName(fullName);
    } else {
      setGuestName("");
    }
  }, [isForSelf, fullName]);

  // Kalkulasi Harga
  const calculateTotal = () => {
    if (!service || !startDateStr || !endDateStr) return 0;
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    if (service.unit === "per_hour") {
      return differenceInHours(end, start) * service.price;
    }
    return (differenceInDays(end, start) || 1) * service.price;
  };

  const totalPrice = calculateTotal();

  // SUBMIT BOOKING (Baru insert ke DB disini)
  const handleSubmit = async () => {
    if (!user) {
      // Simpan URL saat ini agar setelah login balik lagi kesini
      const currentUrl = `/book/${slug}?start=${startDateStr}&end=${endDateStr}`;
      router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }

    if (!fullName || !phone || !email || !guestName) {
      alert("Mohon lengkapi semua data pemesan.");
      return;
    }

    setSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("bookings")
        .insert({
          service_id: service.id,
          user_id: user.id,
          start_time: new Date(startDateStr!).toISOString(),
          end_time: new Date(endDateStr!).toISOString(),
          total_price: totalPrice,
          status: "pending_payment",
          payment_status: "unpaid",
          // Simpan data kontak yang diinput user
          customer_name: guestName, // Nama tamu
          customer_email: email, // Email kontak
          customer_phone: phone, // HP kontak
          notes: isForSelf
            ? "Pesan untuk diri sendiri"
            : `Dipesankan oleh ${fullName}`,
        })
        .select()
        .single();

      if (error) throw error;

      // Redirect ke Payment
      router.push(`/payment/${data.id}`);
    } catch (err: any) {
      alert("Gagal memproses pesanan: " + err.message);
      setSubmitting(false);
    }
  };

  // TAMPILKAN LOADING SKELETON
  if (loading) return <BookingSkeleton />;
  if (!service)
    return <div className="p-10 text-center">Layanan tidak ditemukan</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Simple ala Traveloka */}
      <div className="bg-white shadow-sm border-b border-gray-200 py-4 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-xl font-bold text-gray-800">
            Booking: {service.name}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* KOLOM KIRI: FORM PENGISIAN DATA */}
          <div className="lg:col-span-2 space-y-6">
            {/* CARD 1: Data Pemesan */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                  👤
                </div>
                <h2 className="text-lg font-bold text-gray-800">
                  Data Pemesan
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Nama Lengkap (Sesuai KTP)
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      No. Handphone
                    </label>
                    <input
                      type="tel"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="08123456789"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@contoh.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: Informasi Tamu */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                  🏨
                </div>
                <h2 className="text-lg font-bold text-gray-800">Detail Tamu</h2>
              </div>

              <div className="mb-6 flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <input
                  type="checkbox"
                  id="selfBooking"
                  checked={isForSelf}
                  onChange={(e) => setIsForSelf(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="selfBooking"
                  className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                >
                  Sama dengan pemesan (Pesanan ini untuk saya)
                </label>
              </div>

              {!isForSelf && (
                <div className="animate-fade-in">
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Nama Lengkap Tamu
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Nama tamu yang akan menginap"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Isi sesuai KTP tamu yang akan check-in.
                  </p>
                </div>
              )}

              {isForSelf && (
                <div className="p-4 bg-gray-50 rounded-lg text-gray-600 text-sm">
                  Tamu: <strong>{fullName || "-"}</strong>
                </div>
              )}
            </div>
          </div>

          {/* KOLOM KANAN: RINCIAN HARGA (Sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Rincian Harga
              </h3>

              {/* Info Service */}
              <div className="flex gap-4 mb-4 pb-4 border-b border-gray-100">
                {service.images?.[0] && (
                  <img
                    src={service.images[0]}
                    alt="img"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div>
                  <p className="font-bold text-gray-800 line-clamp-2">
                    {service.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(startDateStr!).toLocaleDateString("id-ID")} -{" "}
                    {new Date(endDateStr!).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>

              {/* Breakdown Harga */}
              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Harga Sewa</span>
                  <span>{formatRupiah(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pajak & Biaya</span>
                  <span>Rp 0</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-blue-600 pt-3 border-t border-gray-100">
                  <span>Total Pembayaran</span>
                  <span>{formatRupiah(totalPrice)}</span>
                </div>
              </div>

              {/* Tombol Lanjut */}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? "Memproses..." : "Lanjutkan Pembayaran"}
              </button>

              <p className="text-xs text-center text-gray-400 mt-4">
                Dengan melanjutkan, Anda menyetujui Syarat & Ketentuan kami.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
