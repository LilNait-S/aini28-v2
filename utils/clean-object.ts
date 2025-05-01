export function cleanObject<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== "" && value !== undefined
    )
  ) as Partial<T>
}
