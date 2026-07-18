import { Badge } from "@/components/ui/badge";

export function DeductionPill({ count }) {
  return (
    <Badge variant="outline" className="bg-[#ffe7e7] h-7 border-[#f60808] text-[#f60808] hover:bg-[#ffe7e7] cursor-pointer rounded-full px-3 py-1">
      - {count} EGP
    </Badge>
  );
}
