'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Tables } from '@/types/supabase';
import { differenceInDays, differenceInHours } from 'date-fns';

type Service = Tables<'services'>;

export default function BookingForm({ service }: { service: Service }) {
  const router = useRouter();

  // State Form (Hanya input user yang perlu di-state)
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  // SOLUSI: Gunakan useMemo untuk menghitung harga secara otomatis
  // Ini menggantikan useState + useEffect yang menyebabkan error tadi.
  const totalPrice = useMemo(() => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validasi Tanggal Terbalik
    if (start >= end) return 0;

    let price = 0;
    if (service.unit === 'per_hour') {
      const hours = differenceInHours(end, start);
      price = hours * service.price;
    } else {
      const days = differenceInDays(end, start) || 1;
      price = days * service.price;
    }
    
    return price;
  }, [startDate, endDate, service]); // Hanya hitung ulang jika 3 variabel ini berubah

  // Handler: Pindah ke Halaman Pengisian Data
  const handleContinue = () => {
    if (!startDate || !endDate) {
      alert('Mohon pilih tanggal check-in dan check-out terlebih dahulu.');
      return;
    }

    if (totalPrice <= 0) {
      alert('Tanggal tidak valid (Check-out harus setelah Check-in).');
      return;
    }
    
    // Kirim data tanggal via URL Query Parameters
    const params = new URLSearchParams({
      start: startDate,
      end: endDate
    });
    
    // Redirect ke halaman /book/[slug]
    router.push(`/book/${service.slug}?${params.toString()}`);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Atur Jadwal</h3>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mulai {service.unit === 'per_hour' ? '(Jam)' : '(Check-in)'}
          </label>
          <input
            type="datetime-local"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Selesai {service.unit === 'per_hour' ? '(Jam)' : '(Check-out)'}
          </label>
          <input
            type="datetime-local"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Bagian Estimasi Harga & Tombol */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600 font-medium">Estimasi Harga:</span>
          <span className="text-lg font-bold text-blue-600">
             {totalPrice > 0 
               ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalPrice) 
               : '-'}
          </span>
        </div>

        <button
          onClick={handleContinue}
          className="w-full py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 active:scale-95 transform duration-100"
        >
          Pesan Sekarang
        </button>
        
        <p className="text-xs text-center text-gray-400 mt-3">
          Anda belum akan dikenakan biaya.
        </p>
      </div>
    </div>
  );
}