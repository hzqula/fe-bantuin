"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  TbSearch,
  TbUserOff,
  TbUserCheck,
  TbShield,
  TbLoader,
} from "react-icons/tb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: "USER" | "ADMIN";
  status: string;
  isSeller: boolean;
  isVerified: boolean;
  createdAt: string;
  profilePicture: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        q: search,
      });

      const res = await fetch(`/api/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        setUsers(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleStatusChange = async (
    userId: string,
    action: "ban" | "unban"
  ) => {
    if (
      !confirm(
        `Yakin ingin ${
          action === "ban" ? "memblokir" : "mengaktifkan"
        } user ini?`
      )
    )
      return;

    setProcessingId(userId);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchUsers();
      } else {
        alert(data.error || "Gagal mengubah status user");
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem");
    } finally {
      setProcessingId(null);
    }
  };

  console.log(users);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Manajemen Pengguna
            </h1>
            <p className="text-muted-foreground text-sm">
              Kelola semua pengguna terdaftar di platform
            </p>
          </div>
        </div>

        {/* Filter & Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative w-full md:w-96">
              <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau email..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setPage(1)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b bg-muted/30">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      User
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Role
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Bergabung
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="h-24 text-center">
                        <div className="flex justify-center items-center gap-2 text-muted-foreground">
                          <TbLoader className="animate-spin" /> Memuat data...
                        </div>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="h-24 text-center text-muted-foreground"
                      >
                        Tidak ada pengguna ditemukan.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={user.profilePicture} />
                              <AvatarFallback>
                                {user.fullName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground">
                                {user.fullName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex flex-col gap-1">
                            {user.role === "ADMIN" ? (
                              <Badge className="w-fit bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200">
                                <TbShield className="mr-1 h-3 w-3" /> Admin
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="w-fit">
                                User
                              </Badge>
                            )}
                            {user.isSeller && (
                              <span className="text-[10px] text-blue-600 font-medium">
                                • Penyedia Jasa
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          {user.status === "active" ? (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              Aktif
                            </Badge>
                          ) : (
                            <Badge variant="destructive">Banned</Badge>
                          )}
                        </td>
                        <td className="p-4 align-middle text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td className="p-4 align-middle text-right">
                          {user.role !== "ADMIN" && (
                            <div className="flex justify-end">
                              {user.status === "active" ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-destructive border-destructive/20 hover:bg-destructive/10"
                                  onClick={() =>
                                    handleStatusChange(user.id, "ban")
                                  }
                                  disabled={processingId === user.id}
                                >
                                  {processingId === user.id ? (
                                    <TbLoader className="animate-spin" />
                                  ) : (
                                    <TbUserOff className="h-4 w-4 mr-1" />
                                  )}
                                  Ban
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600 border-green-200 hover:bg-green-50"
                                  onClick={() =>
                                    handleStatusChange(user.id, "unban")
                                  }
                                  disabled={processingId === user.id}
                                >
                                  {processingId === user.id ? (
                                    <TbLoader className="animate-spin" />
                                  ) : (
                                    <TbUserCheck className="h-4 w-4 mr-1" />
                                  )}
                                  Unban
                                </Button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Sebelumnya
            </Button>
            <span className="flex items-center text-sm text-muted-foreground">
              Halaman {page} dari {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={page === pagination.totalPages}
            >
              Selanjutnya
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
