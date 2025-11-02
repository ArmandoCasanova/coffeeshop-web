export type SnackbarConfig = {
  message?: string;
  duration?: number;
  type?: SnackbarStatus;
};

export type SnackbarContextType = {
  showSnackbar: (options?: {
    message?: string;
    duration?: number;
    type?: SnackbarStatus;
  }) => void;
};

export type SnackbarStatus = "warning" | "error" | "success";
