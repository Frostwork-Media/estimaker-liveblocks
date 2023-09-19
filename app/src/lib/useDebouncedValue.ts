import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, length: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), length);
    return () => clearTimeout(timeout);
  }, [length, value]);

  return debouncedValue;
}
