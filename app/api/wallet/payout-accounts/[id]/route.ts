import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

/**
 * DELETE /api/wallet/payout-accounts/:id
 * Menghapus rekening bank (Proxy ke NestJS)
 */
export async function DELETE(
  request: NextRequest,
  // Perhatikan: Mendefinisikan params sebagai Promise<...> adalah pola yang valid untuk Next.js.
  // Jika ini menyebabkan error di lingkungan Anda, Anda harus meng-await-nya.
  { params }: { params: Promise<{ id: string }> } // Menggunakan tipe Promise agar sesuai dengan error
) {
  try {
    // 🔥 PERBAIKAN UTAMA: Gunakan await untuk membuka Promise params
    const { id } = await params; 
    
    const token = request.headers.get("authorization");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 👉 FORWARD KE NESTJS: DELETE /wallet/payout-accounts/:id
    const response = await fetch(`${API_URL}/wallet/payout-accounts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });

    if (response.ok) {
      // NestJS akan mengembalikan 200 OK jika sukses.
      return NextResponse.json({ success: true, message: "Rekening bank berhasil dihapus" });
    }

    // Tangani error dari NestJS (misalnya 400 Bad Request karena masih ada Payout Pending)
    const data = await response.json();
    
    return NextResponse.json(
      { success: false, error: data.message || data.error || "Gagal menghapus rekening (Unknown)" },
      { status: response.status }
    );

  } catch (error) {
    console.error("Error deleting payout account:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}