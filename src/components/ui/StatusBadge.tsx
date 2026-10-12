"use client";

import { Badge } from "@/components/ui/Badge";
import type { SubmissionStatus } from "@/types";

const STATUS_CONFIG: Record<
    SubmissionStatus,
    { label: string; variant: "primary" | "info" | "success" | "default" | "danger" }
> = {
    NEW: { label: "Nouveau", variant: "primary" },
    READ: { label: "Lu", variant: "info" },
    REPLIED: { label: "Répondu", variant: "success" },
    ARCHIVED: { label: "Archivé", variant: "default" },
    SPAM: { label: "Spam", variant: "danger" },
};

export const SUBMISSION_STATUSES: SubmissionStatus[] = [
    "NEW",
    "READ",
    "REPLIED",
    "ARCHIVED",
    "SPAM",
];

interface StatusBadgeProps {
    status: SubmissionStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const config = STATUS_CONFIG[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
}

export { STATUS_CONFIG };