import {
  Palette,
  Code,
  Database,
  PenTool,
  Calendar,
  GraduationCap,
  Wrench,
  MoreHorizontal,
} from "lucide-react";

export const SERVICE_CATEGORIES = [
  {
    id: "DESIGN",
    label: "Desain Grafis",
    description:
      "Biasanya nih isinya mahasiswa yang dulunya sempat jadi editor berkelazzz",
    icon: Palette,
    color: "text-purple-600",
    bg: "bg-purple-100",
    border: "border-purple-600", // Ubah ke 200/300 agar tidak terlalu tebal visualnya
    tags: ["Logo", "Poster", "Banner", "Feed IG", "UI/UX", "Illustrasi"],
  },
  {
    id: "CODING",
    label: "Pemrograman",
    description:
      "Isinya mahasiswa yang kalau nongkrong masih buka laptop sambil ngoding (katanya)",
    icon: Code,
    color: "text-blue-600",
    bg: "bg-blue-100",
    border: "border-blue-600",
    tags: ["Website", "Skripsi", "Bug Fix", "Landing Page", "Bot"],
  },
  {
    id: "DATA",
    label: "Data & Analisis",
    description:
      "Mahasiswa yang jago ngolah angka dan bikin laporan keren biasanya ada di sini",
    icon: Database,
    color: "text-green-600",
    bg: "bg-green-100",
    border: "border-green-600",
    tags: ["Excel", "SPSS", "Entry Data", "Visualisasi", "Python"],
  },
  {
    id: "WRITING",
    label: "Penulisan",
    description: "Semoga Microsoft Office-nya nggak bajakan, hehe",
    icon: PenTool,
    color: "text-orange-600",
    bg: "bg-orange-100",
    border: "border-orange-600",
    tags: ["Artikel", "Translate", "Makalah", "Resume", "Copywriting"],
  },
  {
    id: "EVENT",
    label: "Event Organizer",
    description: "Yang pasti, isinya bukan mahasiswa kupu-kupu",
    icon: Calendar,
    color: "text-pink-600",
    bg: "bg-pink-100",
    border: "border-pink-600",
    tags: ["Panitia", "MC", "Dekorasi", "Dokumentasi"],
  },
  {
    id: "TUTOR",
    label: "Tutor & Ngajar",
    description: "Mahasiswa yang sabar dan suka berbagi ilmu, MasyaAllah",
    icon: GraduationCap,
    color: "text-indigo-600",
    bg: "bg-indigo-100",
    border: "border-indigo-600",
    tags: ["Matematika", "Bahasa Inggris", "Mengaji", "Pemateri", "Les Privat"],
  },
  {
    id: "TECHNICAL",
    label: "Teknis & Servis",
    description: "Perbaiki sesuatu? Mahasiswa di sini ahlinya",
    icon: Wrench,
    color: "text-red-600",
    bg: "bg-red-100",
    border: "border-red-600",
    tags: ["Install Ulang", "Servis Laptop", , "Servis Mesin Air", ,],
  },
  {
    id: "OTHER",
    label: "Lainnya",
    description:
      "Jasa-jasa yang kadang nggak kepikiran, tapi ternyata ada yang butuh",
    icon: MoreHorizontal,
    color: "text-gray-600",
    bg: "bg-gray-100",
    border: "border-gray-600",
    tags: ["Fotografer", "Ngedit Video", "Isi Kuesioner", "Survei"],
  },
];

export const CATEGORY_LABELS: Record<string, string> =
  SERVICE_CATEGORIES.reduce(
    (acc, cat) => ({ ...acc, [cat.id]: cat.label }),
    {}
  );
