/**
 * 어드민 페이지 전용 타입들
 */

export interface SidebarMenu {
  id: string;
  label: string;
  icon?: string;
  path: string;
  children?: SidebarMenu[];
  disabled?: boolean;
}

export interface TabItem {
  key: "agentCard" | "questionCard";
  label: string;
  content?: any;
}

export interface FormValidationRule {
  field: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  message: string;
}

export interface FormError {
  [field: string]: string | undefined;
}

export type PageMode = "view" | "edit";

export interface OperationResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export type DeploymentStatus = "idle" | "deploying" | "success" | "error";
