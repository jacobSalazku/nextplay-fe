// A labelled group of controls on the new-play setup screen.
export function Fieldset({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-xs font-semibold tracking-wide text-gray-300 uppercase">
        {label}
      </legend>
      {children}
    </fieldset>
  );
}
