import React, { useState } from 'react';
import { Badge, Button } from '@komerce-design/react';

export interface CodeShowcaseCardProps {
  title: string;
  description: string;
  helpers: string[];
  code: string;
  defaultExpanded?: boolean;
}

export function CodeShowcaseCard(props: CodeShowcaseCardProps) {
  const [expanded, setExpanded] = useState(props.defaultExpanded ?? true);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(props.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border-default bg-background-subtle p-5 flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">Full Composable Code</Badge>
            <h3 className="text-sm font-bold text-foreground-default">{props.title}</h3>
          </div>
          <p className="text-xs text-foreground-muted">{props.description}</p>
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {props.helpers.map((h) => (
              <span key={h} className="rounded-md border border-border-default bg-background-default px-2 py-0.5 font-mono text-[11px] text-foreground-default">
                {h}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="small" variant={copied ? 'secondary' : 'primary'} onClick={() => { void handleCopy(); }}>
            {copied ? '✓ Tersalin!' : 'Salin Kode Lengkap'}
          </Button>
          <Button size="small" variant="outline" onClick={() => setExpanded((v) => !v)}>
            {expanded ? 'Lipat Kode' : 'Tampilkan Kode'}
          </Button>
        </div>
      </div>

      {expanded && (
        <pre className="max-h-[460px] overflow-auto rounded-xl border border-border-default bg-background-default p-4 font-mono text-xs leading-relaxed text-foreground-default">
          <code>{props.code}</code>
        </pre>
      )}
    </div>
  );
}
