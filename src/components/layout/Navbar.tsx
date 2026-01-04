import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useData } from '@/hooks/useData';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  User, 
  Home, 
  Info, 
  HelpCircle, 
  LogOut,
  Menu,
  X,
  Plus
} from 'lucide-react';
import { LogoPopup } from '@/components/layout/LogoPopup';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const { user, profile, logout } = useAuth();
  const { getUnreadCount } = useData();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoPopupOpen, setLogoPopupOpen] = useState(false);

  const unreadCount = user ? getUnreadCount(user.id) : 0;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/about', label: 'About', icon: Info },
    { to: '/help', label: 'Help', icon: HelpCircle },
  ];

  return (
    <>
      <nav className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => setLogoPopupOpen(true)}
              className="text-xl font-bold text-foreground hover:text-primary transition-colors cursor-pointer"
            >
              SkillShare Connect
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate('/notifications')}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/create-post')}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Post
              </Button>

              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {profile?.name?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground hidden lg:block">
                  {profile?.name || user?.email}
                </span>
              </div>

              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border py-4 space-y-4">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-2 py-2 rounded-lg transition-colors",
                      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                    )
                  }
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </NavLink>
              ))}
              
              <div className="border-t border-border pt-4 space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    navigate('/notifications');
                    setMobileMenuOpen(false);
                  }}
                >
                  <Bell className="h-5 w-5" />
                  Notifications
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>

                <Button
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    navigate('/create-post');
                    setMobileMenuOpen(false);
                  }}
                >
                  <Plus className="h-5 w-5" />
                  Post Request or Offer
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <LogoPopup open={logoPopupOpen} onOpenChange={setLogoPopupOpen} />
    </>
  );
};
