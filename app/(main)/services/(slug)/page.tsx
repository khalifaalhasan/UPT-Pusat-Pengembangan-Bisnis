import ServiceDetailPage from "@/components/pages/DetailService";

// 1. Definisikan tipe props yang diterima oleh Page
interface PageProps {
    params: {
        slug: string;
    };
}

// 2. Tangkap 'params' di argumen fungsi
export default function DetailServicePage({ params }: PageProps) {
    return (
        // 3. Teruskan 'params' ke komponen ServiceDetailPage
        <ServiceDetailPage params={params} />
    );
}