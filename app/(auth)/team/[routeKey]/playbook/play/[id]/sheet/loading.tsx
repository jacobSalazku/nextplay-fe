// Overrides the parent [id] segment's loading.tsx — the coaching sheet
// never had its own loading state, and that fallback is the wrong shape here.
export default function Loading() {
  return null;
}
