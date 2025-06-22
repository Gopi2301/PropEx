import { Separator } from "@/components/ui/separator";
import { SignOutButton } from "@/components/ui/SignOutButton";
import Image from "next/image";
import Link from "next/link";

// two column layout with left sidebar and right content
const RoleLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex min-h-screen">
            {/* left bar */}
            <div className="w-1/4 p-4 border-r">
                <div className="flex flex-col h-full">
                    <div className="flex-1">
                        {/* Navigation items can go here */}
                        {/* logo */}
                        <div className="flex items-center gap-4">
                            <Image src="/original.png" alt="Logo" width={60} height={60} />
                        </div>
                        <Separator />
                        {/* dashboard, audit, settings */}
                        <div className = "flex flex-col gap-4 p-4">
                            <Link href="/dashboard">Dashboard</Link>
                            <Link href="/audit">Audit</Link>
                            <Link href="/settings">Settings</Link>
                        </div>
                    </div>
                    <div className="mt-auto">
                        <SignOutButton />
                    </div>
                </div>
            </div>

            {/* main content */}
            <div className="w-3/4 p-8">
                {children}
            </div>
        </div>
    );
}

export default RoleLayout;
