import { useEffect } from 'react';

const useDebounce = <T extends readonly unknown[]>(
  effect: () => void,
  dependencies: T,
  delay: number
): void => {
  useEffect(() => {
    const timeout = setTimeout(effect, delay);
    return () => clearTimeout(timeout);
  }, [...dependencies, delay]); 
};

export default useDebounce;