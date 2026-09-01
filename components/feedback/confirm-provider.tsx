'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ConfirmDialog } from './confirm-dialog';

export type ConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: 'danger' | 'primary';
};

type Confirm = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<Confirm | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const close = useCallback((confirmed: boolean) => {
    resolverRef.current?.(confirmed);
    resolverRef.current = null;
    setOptions(null);
  }, []);

  const confirm = useCallback<Confirm>((next) => {
    resolverRef.current?.(false);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
      setOptions(next);
    });
  }, []);

  useEffect(() => {
    return () => resolverRef.current?.(false);
  }, []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {options && <ConfirmDialog open {...options} onClose={close} />}
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): Confirm {
  const confirm = useContext(ConfirmContext);
  if (!confirm) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return confirm;
}

/**
 * Wrap an action so it only runs after the user confirms.
 * `const remove = useConfirmedAction(deletePlayer, { title: '…' });`
 */
export function useConfirmedAction<Args extends unknown[]>(
  action: (...args: Args) => void,
  options: ConfirmOptions,
): (...args: Args) => Promise<void> {
  const confirm = useConfirm();
  return async (...args: Args) => {
    if (await confirm(options)) action(...args);
  };
}
