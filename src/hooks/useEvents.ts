"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  fetchIndexedEvents,
  subscribeToShow,
  SUPABASE_CONFIGURED,
} from "@/lib/supabase";
import { demoEvents, isDemo } from "@/lib/demo";
import type { ShowEvent } from "@/types/events";

export interface UseEventsResult {
  events: ShowEvent[];
  isLoading: boolean;
  indexerOffline: boolean;
  demo: boolean;
}

export function useEvents(limit = 10): UseEventsResult {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["showtime", "events", limit],
    queryFn: () => fetchIndexedEvents(limit),
    enabled: SUPABASE_CONFIGURED && !isDemo,
    staleTime: 20_000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!SUPABASE_CONFIGURED || isDemo) return;
    return subscribeToShow(() => {
      void queryClient.invalidateQueries({ queryKey: ["showtime"] });
    });
  }, [queryClient]);

  if (isDemo) {
    return { events: demoEvents.slice(0, limit), isLoading: false, indexerOffline: false, demo: true };
  }

  if (!SUPABASE_CONFIGURED) {
    return { events: [], isLoading: false, indexerOffline: true, demo: false };
  }

  if (query.isLoading) {
    return { events: [], isLoading: true, indexerOffline: false, demo: false };
  }

  const events = query.data;
  if (!events) {
    return { events: [], isLoading: false, indexerOffline: true, demo: false };
  }

  return { events, isLoading: false, indexerOffline: false, demo: false };
}

export default useEvents;
