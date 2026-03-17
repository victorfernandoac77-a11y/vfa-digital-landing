import { useState, useRef } from "react";
import { useTranslation } from "@/hooks/use-translations";
import { useVerifyAdmin } from "@workspace/api-client-react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  const { t } = useTranslation();
  const [showAdmin, setShowAdmin] = useState(false);
  const [pwd, setPwd] = useState("");
  const timerRef = useRef<NodeJS.Timeout>();
  
  const verifyMutation = useVerifyAdmin();

  const handlePointerDown = () => {
    // 5 second long press
    timerRef.current = setTimeout(() => {
      setShowAdmin(true);
    }, 5000);
  };

  const handlePointerUp = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const onAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyMutation.mutate({ data: { token: pwd } }, {
      onSuccess: (res) => {
        if (res.success) {
          alert("Admin access granted. (Implementation requires context injection)");
          setShowAdmin(false);
        }
      },
      onError: () => {
        alert("Acceso denegado.");
        setPwd("");
      }
    });
  };

  return (
    <footer className="bg-[#0A0A0A] border-t border-white/5 py-12 relative overflow-hidden">
      {/* Decorative cyber lines */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center gap-6 text-center">
        
        {/* Obfuscated Admin Trigger */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onContextMenu={(e) => e.preventDefault()} // prevent context menu on mobile long press
        >
          <Shield className="w-5 h-5 text-primary/50" />
          <span className="font-display font-bold text-xl tracking-widest text-white/80">
            VFA<span className="text-primary/80">Digital</span>
          </span>
        </div>

        <p className="text-muted-foreground font-body text-sm max-w-md">
          {t("footer.motto")}
        </p>
        
        <p className="text-white/20 text-xs mt-8">
          © {new Date().getFullYear()} VFADigital. Engine v1.0.
        </p>
      </div>

      {/* Generic Admin Prompt Modal */}
      {showAdmin && (
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-8 rounded-3xl w-full max-w-sm border-primary/30">
            <h3 className="font-display text-xl text-primary mb-6 text-center">SYSTEM_AUTH</h3>
            <form onSubmit={onAdminSubmit} className="flex flex-col gap-4">
              <Input 
                type="password" 
                value={pwd}
                onChange={e => setPwd(e.target.value)}
                placeholder="..."
                autoFocus
                className="text-center tracking-widest"
              />
              <div className="flex gap-2">
                <Button type="button" variant="ghost" className="flex-1" onClick={() => setShowAdmin(false)}>
                  ABORT
                </Button>
                <Button type="submit" disabled={verifyMutation.isPending} className="flex-1">
                  EXEC
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </footer>
  );
}
