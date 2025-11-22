import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { Database } from '@/types/supabase'; // Import tipe yang tadi digenerate

type service = Database['public']['Tables']['services']['Row'];

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  const { slug } = params;

  // 1. Fetch Service berdasarkan Slug
  const { data: service, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !service) {
    notFound(); // Akan menampilkan halaman 404 Next.js
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Galeri & Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video w-full bg-gray-200 rounded-2xl overflow-hidden relative">
             {service.images && service.images[0] && (
               <img 
                 src={service.images[0]} 
                 alt={service.name} 
                 className="w-full h-full object-cover"
               />
             )}
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{service.name}</h1>
            <p className="text-2xl text-blue-600 font-bold mt-2">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(service.price)}
              <span className="text-sm text-gray-500 font-normal"> / {service.unit}</span>
            </p>
          </div>

          <div className="prose max-w-none text-gray-600">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Deskripsi</h3>
            <p>{service.description}</p>
          </div>

          {/* Render Spesifikasi dari JSONB */}
          {service.specifications && (
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Spesifikasi</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(service.specifications as Record<string, never>).map(([key, value]) => (
                  <div key={key}>
                    <span className="block text-sm text-gray-500 capitalize">{key.replace(/_/g, ' ')}</span>
                    <span className="font-medium text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Kolom Kanan: Form Booking (Akan kita buat interactive componentnya) */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold mb-4">Cek Ketersediaan</h3>
            
            {/* AREA BOOKING COMPONENT (Placeholder) */}
            <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm mb-4">
              Pilih tanggal untuk melihat ketersediaan.
            </div>
            
            <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
              Booking Sekarang
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}