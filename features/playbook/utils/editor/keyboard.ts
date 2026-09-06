// True when the event originated in a field, so global editor shortcuts should
// not steal the keystroke.
export function isTypingTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return (
    !!el &&
    (el.isContentEditable ||
      /^(input|textarea|select)$/i.test(el.tagName ?? ''))
  );
}
