export type LoadState = "idle" | "loading" | "success" | "empty" | "error";

export type DemoStateMode = "populated" | "loading" | "empty" | "error" | "partial";

export interface DataState<T> {
  status: LoadState;
  data?: T;
  error?: string;
}

export interface StateActionFeedback {
  status: "idle" | "loading" | "success" | "error";
  message?: string;
}
