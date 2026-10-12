"use client";

import {
    forwardRef,
    useId,
    type InputHTMLAttributes,
    type ReactNode,
} from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: LucideIcon;
    rightIcon?: ReactNode;
    fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            hint,
            leftIcon: LeftIcon,
            rightIcon,
            fullWidth = true,
            className,
            id,
            ...rest
        },
        ref,
    ) => {
        const generatedId = useId();
        const inputId = id ?? generatedId;
        const hasError = Boolean(error);

        return (
            <div className={cn(fullWidth && "w-full")}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block mb-2 text-sm font-semibold text-foreground"
                    >
                        {label}
                        {rest.required && <span className="ml-1 text-danger">*</span>}
                    </label>
                )}

                <div className="relative">
                    {LeftIcon && (
                        <LeftIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle pointer-events-none" />
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        aria-invalid={hasError}
                        aria-describedby={
                            hasError ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
                        }
                        className={cn(
                            "w-full h-11 rounded-xl bg-surface border text-foreground",
                            "placeholder:text-foreground-subtle",
                            "transition-all duration-200",
                            "focus:outline-none focus:ring-2",
                            LeftIcon ? "pl-10" : "pl-4",
                            rightIcon ? "pr-10" : "pr-4",
                            hasError
                                ? "border-danger focus:border-danger focus:ring-danger/20"
                                : "border-border focus:border-primary focus:ring-primary/20",
                            "disabled:opacity-60 disabled:cursor-not-allowed",
                            className,
                        )}
                        {...rest}
                    />

                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {rightIcon}
                        </div>
                    )}
                </div>

                {hasError && (
                    <p id={`${inputId}-error`} className="mt-1.5 text-xs text-danger">
                        {error}
                    </p>
                )}
                {!hasError && hint && (
                    <p
                        id={`${inputId}-hint`}
                        className="mt-1.5 text-xs text-foreground-subtle"
                    >
                        {hint}
                    </p>
                )}
            </div>
        );
    },
);

Input.displayName = "Input";