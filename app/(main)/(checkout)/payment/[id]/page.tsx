'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Tables } from '@/types/supabase';
import { ChevronDown, ChevronUp, Clock, ShieldCheck, CreditCard, Building2, Wallet } from 'lucide-react'; // Pastikan install lucide-react
import Link from 'next/link';

// --- TIPE DATA ---
interface PageProps {
  params: Promise<{ id: string }>;
}

type BookingWithService = Tables<'bookings'> & {
  service: Tables<'services'> | null;
};

// --- KOMPONEN UTAMA ---
export default function PaymentPage({ params }: PageProps) {
  const router = useRouter();
  const supabase = createClient();

  // State Data
  const [bookingId, setBookingId] = useState<string>('');
  const [booking, setBooking] = useState<BookingWithService | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // State UI
  const [step, setStep] = useState<'selection' | 'upload'>('selection');
  const [selectedMethod, setSelectedMethod] = useState<string>('bca_manual');
  
  // State Upload
  const [uploading, setUploading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  // 1. Init Data
  useEffect(() => {
    const init = async () => {
      const resolvedParams = await params;
      setBookingId(resolvedParams.id);
    };
    init();
  }, [params]);

  // 2. Fetch Booking
  useEffect(() => {
    if (!bookingId) return;
    const fetchBooking = async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`*, service:services (*)`)
        .eq('id', bookingId)
        .single();

      if (error) {
        alert('Data tidak ditemukan');
        router.push('/');
        return;
      }
      setBooking(data as BookingWithService);
      setLoading(false);
    };
    fetchBooking();
  }, [bookingId, supabase, router]);

  // Logic Upload Bukti (Tahap 2)
  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!booking || !file) return;
    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Sesi habis');

      const fileExt = file.name.split('.').pop();
      const fileName = `${bookingId}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload Storage
      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      // Insert Payment Record
      const { error: insertError } = await supabase.from('payments').insert({
        booking_id: booking.id,
        user_id: user.id,
        amount: booking.total_price, // Asumsi bayar full
        payment_type: selectedMethod,
        payment_proof_url: `receipts/${filePath}`,
        status: 'pending'
      });
      if (insertError) throw insertError;

      alert('Pembayaran Berhasil Dikirim!');
      router.push('/dashboard/bookings'); // Balik ke dashboard setelah selesai
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  // Helper
  const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  
  if (loading) return <div className="p-10 text-center">Memuat data transaksi...</div>;
  if (!booking) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* HEADER BIRU SIMPLE */}
      <div className="bg-white border-b border-gray-200 py-4 shadow-sm">
        <div className="container mx-auto px-4 flex items-center gap-2">
          <Link href="/" className="font-bold text-2xl text-blue-600">Traveloka</Link>
          <span className="text-gray-300 text-2xl">|</span>
          <h1 className="text-lg font-bold text-gray-700">Pembayaran</h1>
        </div>
      </div>

      {/* BANNER TIMER (Persis Screenshot) */}
      <div className="bg-blue-600 text-white py-3 px-4 text-center text-sm font-medium flex justify-center items-center gap-2">
        <span>Tenang, harganya tidak akan berubah. Yuk selesaikan pembayaran dalam</span>
        <span className="bg-blue-800 px-2 py-0.5 rounded text-yellow-300 font-mono font-bold">00:59:21</span>
        <Clock className="w-4 h-4" />
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* === KOLOM KIRI: METODE PEMBAYARAN === */}
          <div className="lg:col-span-2 space-y-6">
            
            {step === 'selection' ? (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">Mau bayar pakai metode apa?</h2>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    Pembayaran Aman
                  </div>
                </div>

                {/* LIST METODE PEMBAYARAN */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  
                  {/* Option 1: Transfer Manual (BCA) */}
                  <PaymentOption 
                    id="bca_manual"
                    title="BCA Transfer Manual"
                    icon={<Building2 className="text-blue-600" />}
                    selected={selectedMethod}
                    onSelect={setSelectedMethod}
                    logo="BCA"
                  />

                  {/* Option 2: Mandiri */}
                  <PaymentOption 
                    id="mandiri_manual"
                    title="Mandiri Transfer"
                    icon={<Building2 className="text-yellow-600" />}
                    selected={selectedMethod}
                    onSelect={setSelectedMethod}
                    logo="Mandiri"
                  />

                  {/* Option 3: Lainnya (Dummy) */}
                  <div className="p-4 border-t border-gray-100 flex items-center justify-between opacity-50 cursor-not-allowed">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-6 h-6 text-gray-400" />
                      <span className="text-gray-500 font-medium">Kartu Kredit/Debit</span>
                    </div>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Maintenance</span>
                  </div>
                </div>
              </>
            ) : (
              // === TAMPILAN STEP 2: UPLOAD BUKTI ===
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-fade-in">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Selesaikan Pembayaran</h2>
                
                <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg mb-6">
                  <p className="text-sm text-yellow-800">
                    Silakan transfer sebesar <strong>{formatRupiah(booking.total_price)}</strong> ke rekening di bawah ini, lalu upload bukti transfernya.
                  </p>
                </div>

                <div className="flex flex-col items-center p-6 bg-gray-50 rounded-xl mb-6 border border-dashed border-gray-300">
                  <p className="text-gray-500 text-sm mb-1">Bank BCA</p>
                  <p className="text-3xl font-mono font-bold text-gray-800 tracking-wider">821-098-1234</p>
                  <p className="text-sm text-gray-500 mt-1">a.n. PT Traveloka Clone</p>
                </div>

                <form onSubmit={handleUpload}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Bukti Transfer</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    required
                    onChange={(e) => e.target.files && setFile(e.target.files[0])}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <div className="mt-6">
                    <button
                       type="submit"
                       disabled={uploading || !file}
                       className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50"
                    >
                      {uploading ? 'Mengirim...' : 'Saya Sudah Transfer'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setStep('selection')}
                      className="w-full mt-3 text-gray-500 text-sm hover:underline"
                    >
                      Ganti Metode Pembayaran
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* === KOLOM KANAN: RINCIAN HOTEL (Sticky) === */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-8">
              {/* Header Card */}
              <div className="bg-blue-50 p-4 border-b border-blue-100">
                 <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-gray-800">Rincian Hotel</h3>
                 </div>
                 <p className="text-xs text-gray-500">No. Pesanan {booking.id.slice(0, 8)}</p>
              </div>

              <div className="p-4">
                 <h4 className="font-bold text-gray-900 mb-4">{booking.service?.name}</h4>
                 
                 {/* Tanggal */}
                 <div className="flex border border-gray-200 rounded-lg p-2 mb-4 text-center">
                    <div className="flex-1 border-r border-gray-200 pr-2">
                        <p className="text-xs text-gray-500">Check-in</p>
                        <p className="text-sm font-bold text-gray-800">{new Date(booking.start_time).toLocaleDateString('id-ID')}</p>
                        <p className="text-xs text-gray-400">14:00</p>
                    </div>
                    <div className="flex-1 pl-2">
                        <p className="text-xs text-gray-500">Check-out</p>
                        <p className="text-sm font-bold text-gray-800">{new Date(booking.end_time).toLocaleDateString('id-ID')}</p>
                        <p className="text-xs text-gray-400">12:00</p>
                    </div>
                 </div>

                 {/* Detail Items */}
                 <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                        <span className="text-gray-400">🛏️</span>
                        <span className="text-gray-700">(1x) {booking.service?.unit === 'per_day' ? 'Kamar' : 'Unit'} Standard</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-gray-400">👤</span>
                        <span className="text-gray-700">Tamu: {booking.customer_name}</span>
                    </div>
                 </div>
                 
                 <hr className="my-4" />
                 
                 <div className="bg-green-100 text-green-800 p-2 rounded text-xs font-bold text-center">
                    Ini pilihan yang tepat untuk menginapmu.
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER BAR: TOTAL & BUTTON (Hanya muncul di step selection) */}
      {step === 'selection' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl z-50">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-500">Harga Total</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">{formatRupiah(booking.total_price)}</span>
                <ChevronUp className="w-5 h-5 text-blue-600 cursor-pointer" />
              </div>
            </div>
            
            <button
              onClick={() => setStep('upload')}
              className="w-full md:w-auto bg-orange-500 text-white font-bold text-lg px-8 py-3 rounded-lg hover:bg-orange-600 transition shadow-lg shadow-orange-200"
            >
              Bayar dengan {selectedMethod === 'bca_manual' ? 'BCA Transfer' : 'Transfer Manual'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

// --- SUB KOMPONEN (Untuk List Pembayaran) ---
function PaymentOption({ id, title, icon, selected, onSelect, logo }: any) {
  const isSelected = selected === id;
  return (
    <div 
      onClick={() => onSelect(id)}
      className={`p-4 border-b border-gray-100 cursor-pointer transition ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-600' : 'border-gray-300'}`}>
            {isSelected && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
          </div>
          <div className="flex items-center gap-3">
             {/* Logo Dummy */}
             <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center text-[10px] font-bold text-blue-800">
               {logo}
             </div>
             <span className={`font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>{title}</span>
          </div>
        </div>
        {isSelected && <span className="text-xs font-bold text-blue-600">Terpilih</span>}
      </div>
      
      {/* Accordion Content (Jika terpilih) */}
      {isSelected && (
        <div className="ml-14 mt-3 text-sm text-gray-500 animate-fade-in">
           <p className="mb-2">✓ Terima pembayaran dari semua bank</p>
           <p>✓ Verifikasi manual (Upload bukti transfer)</p>
        </div>
      )}
    </div>
  );
}