import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <p className="text-7xl font-semibold text-foreground tracking-tight">
        404
      </p>
      <h2 className="text-lg font-medium text-foreground mt-4">
        Page Not Found
      </h2>
      <p className="text-sm text-muted-foreground mt-2 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="mt-6">
        <Button variant="outline" size="sm">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
