import * as React from "react";

import { cn } from "@/lib/utils";

import { GalleryVerticalEnd } from "lucide-react"

import { GitHubLoginButton } from "../auth/github-auth-button";
import { GoogleLoginButton } from "../auth/google-auth-button";

export const LoginFormHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col items-center gap-2">
    <div
      className="flex flex-col items-center gap-2 font-medium"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-md">
        <GalleryVerticalEnd className="size-6" />
      </div>
      <span className="sr-only">Acme Inc.</span>
    </div>
    <h1 className="text-xl font-bold">Welcome to Acme Inc.</h1>
    {children}
  </div>
);

export const LoginFormFooter = () => (
  <>
    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
      <span className="relative z-10 bg-background px-2 text-muted-foreground">
        Or
      </span>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      <GitHubLoginButton/>
      <GoogleLoginButton/>
    </div>
  </>
);



const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
