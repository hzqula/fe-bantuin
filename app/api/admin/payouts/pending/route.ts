// app/api/admin/pending/route.ts (DIKOREKSI)
import { NextRequest, NextResponse } from "next/server";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Pastikan URL sudah benar
    const backendUrl = `${API_URL}/admin/payouts/pending`; // Pastikan path benar

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": token,
      },
    });

    // 1. Baca body sebagai teks terlebih dahulu (Mencegah SyntaxError)
    const responseBody = await response.text();

    if (!response.ok) {
      // Jika NestJS mengembalikan status error (4xx atau 5xx)
      try {
        // 2. Coba parse body error dari NestJS (diharapkan JSON)
        const errorData = JSON.parse(responseBody);
        return NextResponse.json(
          { error: errorData.message || errorData.error || "Backend error" },
          { status: response.status }
        );
      } catch (e) {
        // 3. Jika body bukan JSON (misal, respons HTML)
        console.error("Backend returned non-JSON/HTML error. Status:", response.status);
        // Tampilkan error yang lebih spesifik untuk membantu debugging
        return NextResponse.json(
          { error: "Kesalahan koneksi atau NestJS mengembalikan HTML (404/500). Pastikan NestJS berjalan dan URL benar." },
          { status: 502 } 
        );
      }
    }

    // 4. Jika status OK, parse body sukses
    try {
        const data = JSON.parse(responseBody);
        return NextResponse.json(data);
    } catch (e) {
        // Menangani 204 No Content
        return NextResponse.json({ success: true, data: [] });
    }

  } catch (error) {
    console.error("Error forwarding GET pending payouts:", error);
    return NextResponse.json(
      { error: "Kesalahan Internal Server atau Jaringan ke NestJS" },
      { status: 500 }
    );
  }
}