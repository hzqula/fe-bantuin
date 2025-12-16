'use client';

import * as React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  Bell,
  Loader2,
  MailOpen,
  AlertCircle,
  ShoppingCart,
  MessageSquare,
  Wallet,
  Star,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useNotifications,
  useUnreadCount,
  useMarkAllAsRead,
  useMarkAsRead,
} from "@/lib/hooks/useNotifications";
import type { Notification } from "@/app/types/notification";
import { apiClient } from "@/lib/api-client";
import useSWR from "swr";
import { useAuth } from "@/contexts/AuthContext";

interface ActivityLog {
  action: string;
  status: string;
  details: string;
  device?: string;
  timestamp: string;
}

const getIcon = (type: Notification["type"]) => {
  switch (type) {
    case "ORDER":
      return <ShoppingCart className="h-4 w-4 text-blue-600" />;
    case "DISPUTE":
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    case "CHAT":
      return <MessageSquare className="h-4 w-4 text-green-600" />;
    case "WALLET":
      return <Wallet className="h-4 w-4 text-yellow-600" />;
    case "REVIEW":
      return <Star className="h-4 w-4 text-amber-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

const NotificationItem: React.FC<{ notification: Notification }> = ({
  notification,
}) => {
  const markAsRead = useMarkAsRead(notification.id);
  const bgColor = notification.isRead
    ? "bg-transparent"
    : "bg-secondary/10 hover:bg-secondary/20";
  const textColor = notification.isRead ? "text-gray-600" : "text-primary";

  const handleClick = async () => {
    if (!notification.isRead) {
      await markAsRead();
    }
  };

  return (
    <Link
      href={notification.link || "#"}
      passHref
      onClick={handleClick}
      className={cn("block px-2 py-2 transition-colors", bgColor)}
    >
      <div className="flex items-start gap-3">
        {getIcon(notification.type)}
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm break-words leading-tight", textColor)}>
            {notification.content}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
              locale: idLocale,
            })}
          </p>
        </div>
        {!notification.isRead && (
          <div className="size-2 rounded-full bg-secondary shrink-0 mt-1"></div>
        )}
      </div>
    </Link>
  );
};

const NotificationDropdown = () => {
  const { notifications, isLoading, isError } = useNotifications();
  const { unreadCount, isLoadingCount } = useUnreadCount();
  const { markAllAsRead, isMutating } = useMarkAllAsRead();
  const { user } = useAuth(); // AMBIL USER DARI CONTEXT DI SINI

  const handleMarkAll = async (e: React.MouseEvent) => {
    e.preventDefault();
    await markAllAsRead();
  };

  // FETCHER DENGAN TOKEN (PAKAI useCallback supaya stabil)
  const fetcher = React.useCallback(
    async (url: string) => {
      // GANTI DENGAN CARA AMBIL TOKEN KAMU (cek AuthContext kamu)
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No token');
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed');
      }

      return res.json();
    },
    [user] // dependency user
  );

  // FETCH ACTIVITY LOG
  const { data: activityData } = useSWR('/api/activity', fetcher, {
    refreshInterval: 30000,
  });
  const activities: ActivityLog[] = activityData?.data || [];

  const hasNotifications = notifications && notifications.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {isLoadingCount ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary/50" />
          ) : (
            <Bell className="h-5 w-5 text-primary" />
          )}
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className={cn(
                "absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold ring-2 ring-background",
                "bg-red-500 hover:bg-red-600 text-white"
              )}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96 p-0 overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <DropdownMenuLabel className="p-0 text-lg font-bold text-primary">
            Notifikasi & Aktivitas
          </DropdownMenuLabel>
          {hasNotifications && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAll}
              disabled={isMutating || unreadCount === 0}
              className="h-7 text-xs p-1"
            >
              {isMutating ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <MailOpen className="mr-1 h-3 w-3" />
              )}
              Baca Semua
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px] w-full">
          {/* Loading */}
          {isLoading && (
            <div className="text-center py-10">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-gray-500 mt-2">Memuat...</p>
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="text-center py-10 text-destructive">
              Gagal memuat notifikasi.
            </div>
          )}

          {/* Push Notifikasi */}
          {hasNotifications && (
            <>
              {notifications.map((notif, index) => (
                <React.Fragment key={notif.id}>
                  <NotificationItem notification={notif} />
                  {index < notifications.length - 1 && <DropdownMenuSeparator className="m-0" />}
                </React.Fragment>
              ))}
              <DropdownMenuSeparator />
            </>
          )}

          {/* Riwayat Aktivitas */}
          <div className="px-4 py-2 bg-gray-50">
            <p className="text-sm font-semibold text-gray-700">Riwayat Aktivitas</p>
          </div>

          {activities.length === 0 ? (
            <div className="text-center py-6 text-gray-500 text-sm">
              Belum ada aktivitas
            </div>
          ) : (
            activities.slice(0, 10).map((log, index) => (
              <div
                key={`activity-${index}`}
                className="px-4 py-3 hover:bg-gray-50 flex gap-3 border-b last:border-0"
              >
                <div className="mt-1">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {log.action.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{log.details}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {log.device || 'Perangkat tidak diketahui'} •{' '}
                    {formatDistanceToNow(new Date(log.timestamp), {
                      addSuffix: true,
                      locale: idLocale,
                    })}
                  </p>
                </div>
              </div>
            ))
          )}

          <div className="p-3 text-center border-t bg-gray-50">
            <Link href="/notifications" className="text-sm text-primary hover:underline font-medium">
              Lihat semua notifikasi & riwayat →
            </Link>
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;