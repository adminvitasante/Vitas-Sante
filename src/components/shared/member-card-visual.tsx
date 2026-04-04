import { Icon } from "@/components/ui/icon";

interface MemberCardVisualProps {
  memberNumber: string;
  expiry: string;
}

export function MemberCardVisual({ memberNumber, expiry }: MemberCardVisualProps) {
  return (
    <div className="relative w-full max-w-[320px] aspect-[1.586/1] bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div className="uppercase font-black text-[10px] tracking-tighter leading-none">Vita Santé<br />Club</div>
        <Icon name="contactless" size="sm" className="opacity-50" />
      </div>
      <div>
        <div className="text-[10px] uppercase opacity-60 mb-1">Member Number</div>
        <div className="font-mono text-sm tracking-widest">{memberNumber}</div>
      </div>
      <div className="flex justify-between items-end">
        <div className="text-xs font-medium">EXP {expiry}</div>
        <div className="h-6 w-10 bg-white/20 rounded flex items-center justify-center">
          <div className="w-4 h-4 bg-white/40 rounded-full" />
        </div>
      </div>
    </div>
  );
}
