'use client';

import { useRef } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { Button } from '@/components/foundation/button/button';
import type { ConfirmOptions } from './confirm-provider';

type ConfirmDialogProps = ConfirmOptions & {
  open: boolean;
  onClose: (confirmed: boolean) => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  confirmVariant = 'danger',
  onClose,
}: ConfirmDialogProps) {
  const confirmed = useRef(false);

  return (
    <AlertDialog.Root
      open={open}
      onOpenChange={(next) => {
        if (next) return;
        onClose(confirmed.current);
        confirmed.current = false;
      }}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-slate-900 p-6 text-white shadow-2xl shadow-black/50">
          <AlertDialog.Title className="font-righteous text-xl text-white">
            {title}
          </AlertDialog.Title>
          {description && (
            <AlertDialog.Description className="mt-2 text-sm leading-6 text-white/60">
              {description}
            </AlertDialog.Description>
          )}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <AlertDialog.Cancel asChild>
              <Button
                variant="outline"
                className="w-full rounded-full sm:w-auto"
              >
                {cancelLabel}
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button
                variant={confirmVariant}
                className="w-full rounded-full sm:w-auto"
                onClick={() => {
                  confirmed.current = true;
                }}
              >
                {confirmLabel}
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
