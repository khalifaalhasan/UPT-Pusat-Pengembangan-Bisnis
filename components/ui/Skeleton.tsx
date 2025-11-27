export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
  );
}

// Komponen Loading Khusus Halaman Booking (Mirip Screenshot)
export function BookingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri (Form Dummy) */}
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-8 w-1/3 mb-4" /> {/* Judul */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
             <Skeleton className="h-6 w-1/4" />
             <Skeleton className="h-12 w-full" />
             <div className="flex gap-4">
               <Skeleton className="h-12 w-1/2" />
               <Skeleton className="h-12 w-1/2" />
             </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
             <Skeleton className="h-6 w-1/4" />
             <Skeleton className="h-12 w-full" />
          </div>
        </div>
        
        {/* Kolom Kanan (Summary Dummy) */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
             <Skeleton className="h-6 w-1/2" />
             <Skeleton className="h-20 w-full" />
             <hr />
             <Skeleton className="h-8 w-full" />
             <Skeleton className="h-12 w-full rounded-full mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}