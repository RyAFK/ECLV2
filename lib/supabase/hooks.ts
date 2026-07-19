"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseClient } from "./client";
import {
  notificationRowToNotification,
  partnerRowToPartner,
  referralRowToReferral,
  taskRowToTask,
  updateRowToUpdate,
} from "./mappers";
import type { NotificationItem, Partner, Referral, ReferralStage, TaskItem, UpdateItem } from "@/lib/types";
import { PARTNERS } from "@/data/partners";
import { REFERRALS } from "@/data/referrals";
import { TASKS } from "@/data/tasks";
import { UPDATES } from "@/data/updates";
import { NOTIFICATIONS } from "@/data/notifications";
import { useAuth } from "./auth-context";

/**
 * "mock" only ever means "Supabase isn't configured" (local dev without env
 * vars). Once Supabase is configured, an authenticated session always sees
 * real data - an empty result is "supabase" with zero rows, and a failed
 * query is "error", never a silent switch to the shared mock dataset.
 */
export type DataSource = "supabase" | "mock" | "error";

/**
 * Fetches `eclv2.partners` and subscribes to Realtime changes. Falls back to
 * the local mock dataset only when Supabase itself isn't configured.
 */
export function usePartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [source, setSource] = useState<DataSource>("mock");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setPartners(PARTNERS);
      setSource("mock");
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.from("partners").select("*").order("name");
    if (error) {
      console.warn("Supabase partners query failed:", error.message);
      setPartners([]);
      setSource("error");
    } else {
      setPartners((data ?? []).map(partnerRowToPartner));
      setSource("supabase");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time fetch on mount before the realtime subscription attaches
    load();
    const supabase = getSupabaseClient();
    if (!supabase) return;
    const channel = supabase
      .channel("eclv2-partners")
      .on("postgres_changes", { event: "*", schema: "eclv2", table: "partners" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  return { partners, source, loading };
}

/**
 * Fetches `eclv2.referrals` (joined to partner name) and subscribes to
 * Realtime. RLS scopes the returned rows to the caller's role/partner; falls
 * back to mock data only when Supabase isn't configured.
 */
export function useReferrals() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [source, setSource] = useState<DataSource>("mock");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setReferrals(REFERRALS);
      setSource("mock");
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("referrals")
      .select("*, partners(name)")
      .order("referral_date", { ascending: false });
    if (error) {
      console.warn("Supabase referrals query failed:", error.message);
      setReferrals([]);
      setSource("error");
    } else {
      setReferrals((data ?? []).map((row) => referralRowToReferral(row, row.partners?.name ?? "")));
      setSource("supabase");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time fetch on mount before the realtime subscription attaches
    load();
    const supabase = getSupabaseClient();
    if (!supabase) return;
    const channel = supabase
      .channel("eclv2-referrals")
      .on("postgres_changes", { event: "*", schema: "eclv2", table: "referrals" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  const updateStage = useCallback(
    async (id: string, stage: ReferralStage) => {
      const supabase = getSupabaseClient();
      if (!supabase || source === "mock") {
        setReferrals((prev) => prev.map((r) => (r.id === id ? { ...r, stage, lastUpdate: new Date().toISOString().slice(0, 10) } : r)));
        return { error: null };
      }
      const { error } = await supabase
        .from("referrals")
        .update({ stage, last_update: new Date().toISOString().slice(0, 10) })
        .eq("id", id);
      if (!error) await load();
      return { error: error?.message ?? null };
    },
    [source, load]
  );

  return { referrals, source, loading, updateStage };
}

/** Fetches `eclv2.tasks` (clinic/executive only per RLS) and subscribes to Realtime. Mock only when unconfigured. */
export function useTasks() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [source, setSource] = useState<DataSource>("mock");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setTasks(TASKS);
      setSource("mock");
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.from("tasks").select("*").order("due_date", { ascending: true });
    if (error) {
      console.warn("Supabase tasks query failed:", error.message);
      setTasks([]);
      setSource("error");
    } else {
      setTasks((data ?? []).map(taskRowToTask));
      setSource("supabase");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time fetch on mount before the realtime subscription attaches
    load();
    const supabase = getSupabaseClient();
    if (!supabase) return;
    const channel = supabase
      .channel("eclv2-tasks")
      .on("postgres_changes", { event: "*", schema: "eclv2", table: "tasks" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  const toggleComplete = useCallback(
    async (id: string, completed: boolean) => {
      const supabase = getSupabaseClient();
      if (!supabase || source === "mock") {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)));
        return;
      }
      const { error } = await supabase.from("tasks").update({ completed }).eq("id", id);
      if (!error) await load();
    },
    [source, load]
  );

  const removeTask = useCallback(
    async (id: string) => {
      const supabase = getSupabaseClient();
      if (!supabase || source === "mock") {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        return;
      }
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (!error) await load();
    },
    [source, load]
  );

  const createTask = useCallback(
    async (task: { title: string; reason: string; due: string; priority: TaskItem["priority"]; partnerName: string }) => {
      const supabase = getSupabaseClient();
      if (!supabase || source === "mock") {
        setTasks((prev) => [
          { id: `task-${Date.now()}`, title: task.title, reason: task.reason, due: task.due || "Today", dueSort: 0, priority: task.priority, partnerName: task.partnerName, completed: false },
          ...prev,
        ]);
        return;
      }
      const { error } = await supabase.from("tasks").insert({
        title: task.title,
        reason: task.reason,
        priority: task.priority,
        partner_name: task.partnerName || null,
      });
      if (!error) await load();
    },
    [source, load]
  );

  return { tasks, source, loading, toggleComplete, removeTask, createTask };
}

/** Fetches `eclv2.updates` and subscribes to Realtime. Mock only when unconfigured. */
export function useUpdates() {
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [source, setSource] = useState<DataSource>("mock");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setUpdates(UPDATES);
      setSource("mock");
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.from("updates").select("*").order("publish_date", { ascending: false });
    if (error) {
      console.warn("Supabase updates query failed:", error.message);
      setUpdates([]);
      setSource("error");
    } else {
      setUpdates((data ?? []).map(updateRowToUpdate));
      setSource("supabase");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time fetch on mount before the realtime subscription attaches
    load();
    const supabase = getSupabaseClient();
    if (!supabase) return;
    const channel = supabase
      .channel("eclv2-updates")
      .on("postgres_changes", { event: "*", schema: "eclv2", table: "updates" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  return { updates, source, loading };
}

/**
 * Fetches the signed-in user's own `eclv2.notifications` and subscribes to
 * Realtime. Falls back to the local mock feed (with client-side read/dismiss
 * state) only when Supabase isn't configured or there is no signed-in user.
 */
export function useNotifications() {
  const { isConfigured, user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [source, setSource] = useState<DataSource>("mock");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase || !user) {
      setNotifications(NOTIFICATIONS);
      setSource("mock");
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("recipient_user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) {
      console.warn("Supabase notifications query failed:", error.message);
      setNotifications([]);
      setSource("error");
    } else {
      setNotifications((data ?? []).map(notificationRowToNotification));
      setSource("supabase");
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time fetch on mount before the realtime subscription attaches
    load();
    const supabase = getSupabaseClient();
    if (!supabase || !user) return;
    const channel = supabase
      .channel(`eclv2-notifications-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "eclv2", table: "notifications", filter: `recipient_user_id=eq.${user.id}` },
        () => load()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load, user]);

  const markRead = useCallback(
    async (id: string) => {
      const supabase = getSupabaseClient();
      if (!supabase || source === "mock") {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
        return;
      }
      const { error } = await supabase.from("notifications").update({ is_read: true, read_at: new Date().toISOString() }).eq("id", id);
      if (!error) await load();
    },
    [source, load]
  );

  const markAllRead = useCallback(
    async (ids: string[]) => {
      const supabase = getSupabaseClient();
      if (!supabase || source === "mock" || !user) {
        setNotifications((prev) => prev.map((n) => (ids.includes(n.id) ? { ...n, read: true } : n)));
        return;
      }
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .in("id", ids);
      if (!error) await load();
    },
    [source, load, user]
  );

  return { notifications, source, loading, markRead, markAllRead, isConfigured };
}
