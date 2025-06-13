"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

type SearchProps = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
};

interface AppHeaderProps {
  title?: string;
  subTitle?: string;
  onMenuClick?: () => void;
  search?: SearchProps;
  button?: React.ReactNode;
}

export function AppHeader(props: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-gray-900">
              {props.title}
            </h1>
            <p className="text-sm text-gray-500 hidden sm:block">
              {props.subTitle}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center ">
          {props.search && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder={props.search?.placeholder}
                  value={props.search?.value}
                  onChange={(e) => props.search?.onChange?.(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>
            </div>
          )}

          {props.button}
        </div>
      </div>
    </header>
  );
}
