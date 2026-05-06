"use client";

import { useEffect, useState } from "react";

import type { TenantCreatePayload } from "@/components/admin/tenant-create-modal";
import type {
  TenantPlanFilter,
  TenantStatusFilter,
} from "@/components/admin/tenant-management-toolbar";
import {
  createTenantApi,
  deleteAllTenantsApi,
  deleteTenantApi,
  fetchTenants,
  resetTenantsApi,
  updateTenantApi,
} from "@/lib/tenant-api";
import type { TenantRecord, TenantStatus } from "@/types/tenant-management";

function formatDate(date: Date) {
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
}

function addDays(dateText: string, days: number) {
  const [year, month, day] = dateText.split("/").map(Number);
  const nextDate = new Date(year, month - 1, day);
  nextDate.setDate(nextDate.getDate() + days);
  return formatDate(nextDate);
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function useTenantManagement() {
  const [tenants, setTenants] = useState<TenantRecord[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<TenantStatusFilter>("全部狀態");
  const [planFilter, setPlanFilter] = useState<TenantPlanFilter>("全部方案");
  const [selectedTenant, setSelectedTenant] = useState<TenantRecord | null>(null);
  const [editingTenant, setEditingTenant] = useState<TenantRecord | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState("資料會透過 /api/tenants 讀寫，並套用全站快取。");

  useEffect(() => {
    let isMounted = true;

    fetchTenants()
      .then((apiTenants) => {
        if (!isMounted) return;
        setTenants(apiTenants);
        setNotice("租戶資料已從 API 載入，並寫入全站快取。");
      })
      .catch((error: unknown) => {
        if (!isMounted) return;
        setNotice(getErrorMessage(error, "租戶 API 載入失敗。"));
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredTenants = tenants.filter((tenant) => {
    const keyword = query.trim().toLowerCase();
    const matchesKeyword =
      !keyword ||
      tenant.name.toLowerCase().includes(keyword) ||
      tenant.contact.toLowerCase().includes(keyword) ||
      tenant.username.toLowerCase().includes(keyword) ||
      tenant.nickname.toLowerCase().includes(keyword);
    const matchesStatus =
      statusFilter === "全部狀態" || tenant.status === statusFilter;
    const matchesPlan = planFilter === "全部方案" || tenant.plan === planFilter;
    return matchesKeyword && matchesStatus && matchesPlan;
  });

  async function createTenant(payload: TenantCreatePayload) {
    try {
      const result = await createTenantApi(payload);
      setTenants((currentTenants) => [result.data, ...currentTenants]);
      setIsCreateOpen(false);
      setNotice(`已透過 API 建立 ${result.data.name}，租戶帳號：${result.data.username}。`);
    } catch (error) {
      setNotice(getErrorMessage(error, "新增租戶失敗。"));
    }
  }

  async function saveTenantEdit(tenant: TenantRecord, name: string, contact: string) {
    try {
      const result = await updateTenantApi(tenant.id, { name, contact });
      setTenants((currentTenants) =>
        currentTenants.map((item) =>
          item.id === tenant.id ? result.data : item
        )
      );
      setEditingTenant(null);
      setNotice(`已透過 API 更新 ${tenant.name} 的租戶資料。`);
    } catch (error) {
      setNotice(getErrorMessage(error, "更新租戶失敗。"));
    }
  }

  async function toggleSuspension(tenant: TenantRecord) {
    const nextStatus: TenantStatus =
      tenant.status === "已停權" ? "啟用中" : "已停權";
    try {
      const result = await updateTenantApi(tenant.id, { status: nextStatus });
      setTenants((currentTenants) =>
        currentTenants.map((item) =>
          item.id === tenant.id ? result.data : item
        )
      );
      setNotice(`${tenant.name} 已透過 API ${nextStatus === "已停權" ? "停權" : "啟用"}。`);
    } catch (error) {
      setNotice(getErrorMessage(error, "更新租戶狀態失敗。"));
    }
  }

  async function extendTenant(tenant: TenantRecord) {
    const nextExpiredAt = addDays(tenant.expiredAt, 30);
    try {
      const result = await updateTenantApi(tenant.id, {
        expiredAt: nextExpiredAt,
      });
      setTenants((currentTenants) =>
        currentTenants.map((item) =>
          item.id === tenant.id ? result.data : item
        )
      );
      setNotice(`${tenant.name} 到期日已透過 API 延長至 ${nextExpiredAt}。`);
    } catch (error) {
      setNotice(getErrorMessage(error, "延長到期日失敗。"));
    }
  }

  async function deleteTenant(tenant: TenantRecord) {
    try {
      await deleteTenantApi(tenant.id);
      setTenants((currentTenants) =>
        currentTenants.filter((item) => item.id !== tenant.id)
      );
      setNotice(`已透過 API 刪除 ${tenant.name}。`);
    } catch (error) {
      setNotice(getErrorMessage(error, "刪除租戶失敗。"));
    }
  }

  function deleteAllTenants() {
    deleteAllTenantsApi()
      .then((result) => {
        setTenants(result.data);
        setSelectedTenant(null);
        setNotice("已透過 API 刪除全部租戶。");
      })
      .catch((error: unknown) => {
        setNotice(getErrorMessage(error, "刪除全部租戶失敗。"));
      });
  }

  function restoreTenants() {
    resetTenantsApi()
      .then((result) => {
        setTenants(result.data);
        setNotice("已透過 API 復原預設租戶資料。");
      })
      .catch((error: unknown) => {
        setNotice(getErrorMessage(error, "復原資料失敗。"));
      });
  }

  return {
    tenants,
    filteredTenants,
    query,
    statusFilter,
    planFilter,
    selectedTenant,
    editingTenant,
    isCreateOpen,
    isLoading,
    notice,
    setQuery,
    setStatusFilter,
    setPlanFilter,
    setSelectedTenant,
    setEditingTenant,
    setIsCreateOpen,
    createTenant,
    saveTenantEdit,
    toggleSuspension,
    extendTenant,
    deleteTenant,
    deleteAllTenants,
    restoreTenants,
  };
}
