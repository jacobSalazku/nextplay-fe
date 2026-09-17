// Overrides the parent playbook segment's loading.tsx — this route never had
// a loading state of its own, and that fallback is the wrong shape here.
export default function Loading() {
  return null;
}
