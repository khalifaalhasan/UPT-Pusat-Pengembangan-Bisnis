import { createClient } from "@/utils/supabase/server";
import ServiceManager from "@/components/admin/ServiceManager";
import { Tables } from "@/types/supabase";

// Kita export tipe ini supaya bisa dipakai di ServiceManager juga
export type ServiceWithCategory = Tables<"services"> & {
  categories: {
    name: string;
  } | null;
};

export default async function AdminServicesPage() {
  const supabase = await createClient();

  const { data: services } = await supabase
    .from("services")
    .select(
      `
      *,
      categories (
        name
      )
    `
    )
    .order("created_at", { ascending: false });

  // Casting aman dari unknown ke tipe custom kita
  const typedServices = (services as unknown as ServiceWithCategory[]) || [];

  return <ServiceManager initialServices={typedServices} />;
}