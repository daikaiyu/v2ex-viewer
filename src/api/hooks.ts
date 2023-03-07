import { useState, useRef, useEffect } from "react";
import { Notification, Reply, Topic, TopicSource, Response, Node } from "./types";
import { useCachedState, useFetch } from "@raycast/utils";
import produce from "immer";
import { getToken, hasToken } from "../utils/preference";
import { Cache, showToast, Toast } from "@raycast/api";
import { showLoadingToast, showSuccessfulToast, showFailedToast } from "../utils/toast";

const baseURL = "https://www.v2ex.com/api/v2";

export type Options<U = undefined> = { initialData?: U; execute?: boolean };
export const useProtectedApi = <T = unknown, U = undefined>(api: string, options?: Options<U>) => {
  const token = getToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  console.log(api, options?.execute !== undefined ? options.execute : true);

  const result = useFetch<Response<T>, U>(baseURL + api, {
    headers,
    execute: options?.execute !== undefined ? options.execute : true,
    initialData: options?.initialData,
    keepPreviousData: true,
    onWillExecute: async () => {
      await showLoadingToast({
        message: api,
      });
    },
    onData: async () => {
      await showSuccessfulToast({
        message: api,
      });
    },
    onError: async (error) => {
      await showFailedToast({
        title: error.name,
        message: error.message,
      });
    },
  });

  return { ...result, data: result.data?.result, isSuccess: result.data?.success };
};
export const useNodeTopics = (nodeName: string) => {
  const topics = useProtectedApi<Omit<Topic, "member" | "node">[]>(`/nodes/${nodeName}/topics`);
  return topics;
};
export const useTopic = (id: number, options?: { initialData?: Omit<Topic, "member" | "node"> }) => {
  const topic = useProtectedApi<Topic, Omit<Topic, "member" | "node">>(`/topics/${id}`, {
    initialData: options?.initialData,
    execute: useCachedState("topic-show-details", false)[0],
  });

  return topic;
};
export const useTopicReplies = (id: number) => {
  const replies = useProtectedApi<Reply[], Reply[]>(`/topics/${id}/replies`, {
    initialData: [],
    execute: useCachedState("topic-show-details", false)[0],
  });
  return replies;
};
export const useNode = (nodeName: string) => {
  const node = useProtectedApi<Node>(`/nodes/${nodeName}`);
  return node;
};

export const useNotifications = () => {
  const notifications = useProtectedApi<Notification[]>("/notifications");
  return notifications;
};
