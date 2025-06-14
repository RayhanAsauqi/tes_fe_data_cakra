import { useEffect, useRef, useState } from "react";

export default function useDebounce<T>(initialState: T, delay: number = 300) {
  const [state, setState] = useState<T>(initialState);
  const [debounceState, setDebounceState] = useState<T>(initialState);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevState = useRef<T>(initialState);

  useEffect(() => {
    if (prevState.current !== state) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setDebounceState(state);
        prevState.current = state;
      }, delay);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [state, delay]);

  return [debounceState, state, setState] as const;
}
