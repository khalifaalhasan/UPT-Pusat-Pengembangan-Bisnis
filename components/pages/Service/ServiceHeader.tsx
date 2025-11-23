"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tables } from "@/types/supabase";
import { format, addDays, isSameDay, isWithinInterval } from "date-fns";
import { id } from "date-fns/locale";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css"; // Default style

type Service = Tables<"services">;
type Booking = Tables<"bookings">;

interface ServiceHeaderProps {
  service: Service;
  existingBookings: Booking[];
}

export default function ServiceHeader({
  service,
  existingBookings,
}: ServiceHeaderProps) {
  const router = useRouter();
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // State untuk Harian (Range)
  const [range, setRange] = useState<DateRange | undefined>();

  // State untuk Jam (Datetime Local)
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");

  // Tutup kalender jika klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [calendarRef]);

  // LOGIC 1: Convert Existing Bookings to Disabled Dates (Khusus Harian)
  const disabledDays = existingBookings.map((b) => ({
    from: new Date(b.start_time),
    to: new Date(b.end_time),
  }));

  // LOGIC 2: Handle Submit
  const handleSearch = () => {
    let startStr = "";
    let endStr = "";

    if (service.unit === "per_day") {
      if (!range?.from || !range?.to) {
        alert("Pilih tanggal check-in dan check-out");
        return;
      }
      startStr = range.from.toISOString();
      endStr = range.to.toISOString();
    } else {
      // Logic Per Jam
      if (!startDateTime || !endDateTime) {
        alert("Pilih jam mulai dan selesai");
        return;
      }
      startStr = new Date(startDateTime).toISOString();
      endStr = new Date(endDateTime).toISOString();
    }

    const params = new URLSearchParams({
      start: startStr,
      end: endStr,
    });

    // Redirect ke halaman booking process
    router.push(`/book/${service.slug}?${params.toString()}`);
  };

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm py-3 px-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-4 justify-between">
        {/* KIRI: Nama Service */}
        <div className="flex items-center gap-3 w-full md:w-1/3">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">🏢</div>
          <div className="truncate">
            <h2 className="font-bold text-gray-900 truncate">{service.name}</h2>
            <p className="text-xs text-gray-500">
              Mulai{" "}
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(service.price)}{" "}
              / {service.unit === "per_day" ? "Malam" : "Jam"}
            </p>
          </div>
        </div>

        {/* TENGAH: Input Tanggal (Sesuai Unit) */}
        <div className="w-full md:flex-1 bg-gray-50 rounded-lg border border-gray-200 p-1 flex items-center relative">
          {service.unit === "per_day" ? (
            // === MODE HARIAN (Kalender Range) ===
            <div className="w-full relative" ref={calendarRef}>
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 rounded-md transition"
              >
                <span className="text-gray-500">📅</span>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                    Check-in — Check-out
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {range?.from
                      ? format(range.from, "dd MMM yyyy")
                      : "Pilih Tanggal"}
                    {" — "}
                    {range?.to ? format(range.to, "dd MMM yyyy") : "..."}
                  </p>
                </div>
              </button>

              {/* Popover Kalender */}
              {showCalendar && (
                <div className="absolute top-14 left-0 md:left-1/2 md:-translate-x-1/2 bg-white shadow-2xl rounded-xl border border-gray-100 p-4 z-50">
                  <DayPicker
                    mode="range"
                    selected={range}
                    onSelect={setRange}
                    disabled={[
                      { before: new Date() }, // Disable masa lalu
                      ...disabledDays, // Disable tanggal yg sudah dibooking
                    ]}
                    numberOfMonths={2}
                    pagedNavigation
                    captionLayout="dropdown" // Style lebih modern
                  />
                </div>
              )}
            </div>
          ) : (
            // === MODE PER JAM (Datetime Local) ===
            <div className="w-full flex gap-2">
              <div className="flex-1 px-3">
                <label className="text-[10px] text-gray-400 font-bold uppercase">
                  Mulai
                </label>
                <input
                  type="datetime-local"
                  className="w-full bg-transparent text-sm font-medium outline-none"
                  value={startDateTime}
                  onChange={(e) => setStartDateTime(e.target.value)}
                />
              </div>
              <div className="w-px bg-gray-200 my-1"></div>
              <div className="flex-1 px-3">
                <label className="text-[10px] text-gray-400 font-bold uppercase">
                  Selesai
                </label>
                <input
                  type="datetime-local"
                  className="w-full bg-transparent text-sm font-medium outline-none"
                  value={endDateTime}
                  onChange={(e) => setEndDateTime(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* KANAN: Tombol Aksi */}
        <div className="w-full md:w-auto">
          <button
            onClick={handleSearch}
            className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 active:scale-95"
          >
            {service.unit === "per_day" ? "Booking Sekarang" : "Cek Jadwal"}
          </button>
        </div>
      </div>
    </div>
  );
}
