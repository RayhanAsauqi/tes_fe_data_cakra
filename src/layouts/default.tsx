import { AppHeader } from "@/components/container/header";
import { Sidebar } from "@/components/container/sidebar";
import { useState } from "react";

type DefaultLayoutProps = {
  children: React.ReactNode;
  pageTitle?: string;
  subTitle?: string;
  className?: string;
  button?: React.ReactNode;
  search?: {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
  };
};

export default function DefaultLayout(props: DefaultLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <main
        className={`transition-all duration-300 ${
          sidebarOpen ? "md:ml-64" : "md:ml-16"
        }`}
      >
        <Sidebar onToggle={setSidebarOpen} />
        <AppHeader
          title={props.pageTitle}
          subTitle={props.subTitle}
          onMenuClick={() => setSidebarOpen(true)}
          button={props.button}
          {...(props.search ? { search: props.search } : {})}
        />
        <section className={`p-4 md:p-6 ${props.className || ""}`}>
          {props.children}
        </section>
      </main>
    </div>
  );
}
