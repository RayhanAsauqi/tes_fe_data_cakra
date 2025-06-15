import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Users,
  Menu,
  X,
  Newspaper,
  User,
  LogOut,
  ChevronsUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { AuthStore } from "@/lib/store/auth-store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type SidebarItem = {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
};

const sidebarItems: SidebarItem[] = [
  {
    icon: Newspaper,
    label: "Articles",
    href: "/",
  },
];

type ImprovedSidebarProps = {
  className?: string;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
};

const getIsMobile = () => {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
};

const getInitialSidebarState = () => {
  if (typeof window === "undefined") return false;
  return !getIsMobile();
};

export function Sidebar({
  className,
  isOpen: controlledIsOpen,
  onToggle,
}: ImprovedSidebarProps) {
  const { user, getMe } = AuthStore();
  const [isMobile, setIsMobile] = useState(() => getIsMobile());
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [internalIsOpen, setInternalIsOpen] = useState(() =>
    getInitialSidebarState()
  );
  const location = useLocation();
  const initialized = useRef<boolean>(false);

  useEffect(() => {
    getMe();
    if (!initialized.current && onToggle) {
      onToggle(getInitialSidebarState());
      initialized.current = true;
    }
  }, [getMe, onToggle]);

  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const isLinkActive = (href: string) => {
    if (href === "/" && location.pathname === "/") {
      return true;
    }
    if (href !== "/" && location.pathname.startsWith(href)) {
      return true;
    }
    return false;
  };

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    if (controlledIsOpen === undefined) {
      setInternalIsOpen(newIsOpen);
    }
    onToggle?.(newIsOpen);
  };

  const handleLinkClick = () => {
    if (isMobile && isOpen) {
      if (controlledIsOpen === undefined) {
        setInternalIsOpen(false);
      }
      onToggle?.(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = getIsMobile();
      setIsMobile(mobile);
      if (mobile && controlledIsOpen === undefined) {
        setInternalIsOpen(false);
        onToggle?.(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [controlledIsOpen, onToggle]);

  useEffect(() => {
    if (isMobile && isOpen && controlledIsOpen === undefined) {
      setInternalIsOpen(false);
      onToggle?.(false);
    }
  }, [location.pathname, isMobile, isOpen, controlledIsOpen, onToggle]);
  const handleLogout = () => {
    AuthStore.getState().clearAuth();
    setComboboxOpen(false);
    handleLinkClick();
  };
  const userOptions = [
    {
      value: "profile",
      label: "View Profile",
      icon: User,
    },
    {
      value: "logout",
      label: "Logout",
      icon: LogOut,
      action: handleLogout,
    },
  ];

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={handleToggle}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-800 text-white transition-all duration-300",
          isMobile
            ? isOpen
              ? "w-64"
              : "w-0 overflow-hidden"
            : isOpen
            ? "w-64"
            : "w-16",
          className
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700">
          {isOpen && <h2 className="text-xl font-bold truncate">Travel App</h2>}
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-slate-700 shrink-0"
            onClick={handleToggle}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {sidebarItems.map((item) => {
              const isActive = isLinkActive(item.href);

              return (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    onClick={handleLinkClick}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md transition-colors",
                      isActive
                        ? "bg-slate-700 text-white"
                        : "text-slate-300 hover:bg-slate-700 hover:text-white",
                      !isOpen && "justify-center"
                    )}
                  >
                    <item.icon size={20} className="shrink-0" />
                    {isOpen && (
                      <span className="ml-3 truncate">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          className={cn(
            "p-4 border-t border-slate-700",
            isMobile && !isOpen && "hidden"
          )}
        >
          {isOpen ? (
            user ? (
              <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    role="combobox"
                    aria-expanded={comboboxOpen}
                    className="w-full justify-between h-auto p-2 hover:bg-slate-700 text-white"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center shrink-0">
                        <Users size={16} />
                      </div>
                      <div className="ml-3 min-w-0 text-left">
                        <p className="text-sm font-medium truncate">
                          {user.username}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0" align="end">
                  <Command>
                    <CommandInput placeholder="Search options..." />
                    <CommandList>
                      <CommandEmpty>No options found.</CommandEmpty>
                      <CommandGroup>
                        {userOptions.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={() => {
                              if (option.action) {
                                option.action();
                              } else {
                                setComboboxOpen(false);
                              }
                            }}
                            className={cn(
                              "cursor-pointer",
                              option.value === "logout" &&
                                "text-red-600 focus:text-red-600"
                            )}
                          >
                            <option.icon className="mr-2 h-4 w-4" />
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            ) : (
              <Link
                to="/auth"
                className="flex items-center hover:opacity-80 transition"
                onClick={handleLinkClick}
              >
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarFallback className="bg-slate-600 text-white text-xs">
                    <User size={16} />
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3 min-w-0">
                  <p className="text-sm font-medium truncate italic text-slate-300">
                    Anonymous
                  </p>
                  <p className="text-xs text-slate-500 truncate italic">
                    Click to login
                  </p>
                </div>
              </Link>
            )
          ) : (
            !isMobile && (
              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                  <Users size={16} />
                </div>
              </div>
            )
          )}
        </div>
      </aside>
    </>
  );
}
