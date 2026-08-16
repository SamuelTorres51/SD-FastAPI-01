import { CircleCheckBig, LogOut } from "lucide-react";
import { Link } from "react-router";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";

export interface HeaderUser {
  email: string;
  name: string;
}

interface SiteHeaderProps {
  onSignOut?: () => void;
  user?: HeaderUser | null;
}

function getInitials(name: string) {
  // biome-ignore lint/performance/useTopLevelRegex: .
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  const first = parts[0].charAt(0);
  // biome-ignore lint/style/useAtIndex: .
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return (first + last).toUpperCase();
}

export function SiteHeader({ onSignOut, user }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link className="flex items-center gap-2 font-semibold" to="/">
          <CircleCheckBig className="size-5" />
          <span>Tarefas</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>

              <div className="block leading-tight">
                <p className="font-medium text-sm">{user.name}</p>
                <p className="text-muted-foreground text-xs">{user.email}</p>
              </div>
            </div>

            <Button
              className="flex items-center gap-2"
              onClick={onSignOut}
              size="sm"
              variant="ghost"
            >
              <span>Sair</span>
              <LogOut />
            </Button>
          </div>
        ) : (
          <nav className="flex items-center gap-2">
            <Button render={<Link to="/login" />} size="sm" variant="ghost">
              Entrar
            </Button>
            <Button render={<Link to="/register" />} size="sm">
              Criar Conta
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
