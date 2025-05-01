import { appConfig } from "@/config"
import axios from "axios"
import { makeApiUrl } from "../config"

// Current environment from appConfig
export const environment = appConfig.environment

// API version prefix
export const prefix = "/api/v1"

// Backend base paths for different environments
export const backendBasePath = {
  production: appConfig.backend_base_path,
  development: "http://localhost:4444",
  test: appConfig.backend_base_path,
} as const

// Generate base path based on environment
export const makeBasePath = (
  environment: "development" | "production" | "test",
  hasPrefix = true
) => {
  const resolvedPrefix = hasPrefix ? prefix : undefined

  switch (environment) {
    case "production":
      return makeApiUrl(backendBasePath.production, resolvedPrefix)
    case "development":
      return makeApiUrl(backendBasePath.development, resolvedPrefix)
    case "test":
      return makeApiUrl(backendBasePath.test, resolvedPrefix)
    default:
      return makeApiUrl(backendBasePath.development, resolvedPrefix)
  }
}

// Axios instance for API requests
export const aini28API = axios.create({
  baseURL: makeBasePath(environment),
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

// Generic function for authenticated API requests
export const genericAuthRequest = async (
  method: "get" | "post" | "put" | "delete" | "patch",
  path: string,
  data?: Record<string, unknown> | unknown[]
) => {
  const response = await aini28API({
    method,
    url: path,
    withCredentials: true, // Include cookies
    params: method === "get" ? data : undefined,
    data: method !== "get" ? data : undefined,
  })

  return response.data
}
