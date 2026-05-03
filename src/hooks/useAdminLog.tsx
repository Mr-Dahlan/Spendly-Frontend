import { useState, useEffect, useCallback } from "react";
import { adminLogService } from "../services/adminlogs";
import type { AdminLog, AdminLogFilters, CreateAdminLogPayload } from "../types/adminlog";

// ─────────────────────────────────────────────
// Hook: fetch semua log (seluruh admin)
// ─────────────────────────────────────────────
export function useAdminLogs(filters: AdminLogFilters = {}) {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminLogService.getAll(filters);
      setLogs(result.data);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch admin logs");
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, total, isLoading, error, refetch: fetchLogs };
}

// ─────────────────────────────────────────────
// Hook: fetch log milik admin yang sedang login
// ─────────────────────────────────────────────
export function useMyAdminLogs(filters: AdminLogFilters = {}) {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await adminLogService.getMine(filters);
      setLogs(result.data);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch my admin logs");
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, total, isLoading, error, refetch: fetchLogs };
}

// ─────────────────────────────────────────────
// Hook: create log secara manual
// ─────────────────────────────────────────────
export function useCreateAdminLog() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const createAdminLog = useCallback(
    async (
      payload: CreateAdminLogPayload,
      onSuccess?: (data: AdminLog) => void
    ) => {
      setIsLoading(true);
      setError(null);
      setMessage(null);
      try {
        const result = await adminLogService.create(payload);
        setMessage(result.message);
        onSuccess?.(result.data);
        return result.data;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to create admin log";
        setError(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { createAdminLog, isLoading, error, message };
}