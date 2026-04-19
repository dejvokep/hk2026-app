'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {ArrowLeft, Save} from 'lucide-react';
import Link from 'next/link';
import { Group } from '@/lib/types';
import { ApiReceipt } from '@/app/zone/scan/page';
import ProfileIcon from "@/components/profile-icon";

function SliderThumb() {
  return (
    <svg width="21" height="13.5" viewBox="0 0 21 14" fill="none" style={{ display: 'block' }}>
      <rect x="0" y="0" width="21" height="14" rx="4" fill="#3b82f6" />
      <line x1="7" y1="4" x2="7" y2="10" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="10.5" y1="4" x2="10.5" y2="10" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="14" y1="4" x2="14" y2="10" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function EditableNumber({ value, suffix, width, onCommit, fontSize = 16, fontWeight = 500, color = '#fff' }: { value: number; suffix: string; width: number; onCommit: (val: number) => void; fontSize?: number; fontWeight?: number; color?: string }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editing) {
      // Update draft only when value changes and we're not editing
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDraft(String(value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const start = () => {
    setDraft(String(value));
    setEditing(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 0);
  };

  const commit = () => {
    const parsed = parseFloat(draft.replace(',', '.'));
    if (!isNaN(parsed)) onCommit(parsed);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(String(value));
    setEditing(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    }
  };

  if (editing) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'baseline' }}>
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKey}
          inputMode="decimal"
          style={{
            width,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            borderBottom: '1px solid #3b82f6',
            fontSize,
            fontWeight,
            color,
            fontFamily: 'inherit',
            textAlign: 'right',
            padding: 0,
            caretColor: '#3b82f6',
          }}
        />
        {suffix && <span style={{ fontSize, fontWeight, color, marginLeft: 1 }}>{suffix}</span>}
      </span>
    );
  }

  return (
    <span
      onClick={start}
      style={{ fontSize, fontWeight, color, cursor: 'text', userSelect: 'none' }}
    >
      {value}
      {suffix}
    </span>
  );
}

function PersonSliderRow({
  user,
  percent,
  onChange,
  locked,
  total,
}: {
  user: { _id: string; name: string };
  percent: number;
  onChange: (p: number) => void;
  locked: boolean;
  total: number;
}) {
  const amount = (total * percent) / 100;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = e.currentTarget;
    const rect = track.getBoundingClientRect();

    const update = (clientX: number) => {
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const pct = Math.round((x / rect.width) * 100);
      onChange(pct);
    };

    update(e.clientX);

    const move = (ev: PointerEvent) => update(ev.clientX);
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const handleAmountCommit = (eur: number) => {
    const clamped = Math.max(0, Math.min(total, eur));
    const pct = Math.round((clamped / total) * 100);
    onChange(pct);
  };

  const handlePercentCommit = (pct: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(pct)));
    onChange(clamped);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ProfileIcon id={user._id} size={"md"}/>
          <span style={{ fontSize: 16, fontWeight: 400, color: '#fff' }}>
            {user.name}
          </span>
          {locked && (
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#3b82f6',
                display: 'inline-block',
              }}
            />
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <EditableNumber
            value={parseFloat(amount.toFixed(2))}
            suffix="€"
            width={52}
            onCommit={handleAmountCommit}
            fontSize={16}
            fontWeight={500}
          />
          <span style={{ fontSize: 16, color: '#a0a0a0' }}>·</span>
          <EditableNumber
            value={percent}
            suffix="%"
            width={28}
            onCommit={handlePercentCommit}
            fontSize={14}
            fontWeight={500}
            color="#a0a0a0"
          />
        </div>
      </div>

      <div
        onPointerDown={handlePointerDown}
        style={{
          position: 'relative',
          width: '100%',
          height: 24,
          cursor: 'pointer',
          touchAction: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            height: 2,
            background: '#4b4c52',
            borderRadius: 1,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            height: 3,
            width: `${percent}%`,
            background: '#3b82f6',
            borderRadius: 1,
            transition: 'width 0.1s ease-out',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: `calc(${percent}% - 10.5px)`,
            top: '50%',
            transform: 'translateY(-50%)',
            transition: 'left 0.1s ease-out',
          }}
        >
          <SliderThumb />
        </div>
      </div>
    </div>
  );
}

export default function ShareStage({
  receipt,
  group,
    sw,
  onComplete: onCompleteAction,
}: {
  receipt: ApiReceipt,
    sw: () => void,
    group: Group & { users: { _id: string; name: string }[] };
  onComplete?: () => void;
  onCompleteAction?: () => void;
}) {
  const onComplete = onCompleteAction || (() => {});
  const [splits, setSplits] = useState<{ [key: string]: number }>(() => {
    const initial: { [key: string]: number } = {};
    const equal = Math.round(100 / group.users.length);
    group.users.forEach((user) => {
      initial[user._id] = equal;
    });
    return initial;
  });

  const [locked, setLocked] = useState<string[]>([]);

  const updateSplit = (userId: string, newPercent: number) => {
    const allOthers = group.users.map((u) => u._id).filter((id) => id !== userId);
    const lockedOthers = allOthers.filter((id) => locked.includes(id));
    const freeOthers = allOthers.filter((id) => !locked.includes(id));

    const lockedTotal = lockedOthers.reduce((s, id) => s + splits[id], 0);
    const maxAllowed = Math.max(0, 100 - lockedTotal);
    const clampedPercent = Math.min(newPercent, maxAllowed);
    const remainder = 100 - lockedTotal - clampedPercent;

    const next = { ...splits, [userId]: clampedPercent };
    lockedOthers.forEach((id) => {
      next[id] = splits[id];
    });

    if (freeOthers.length > 0) {
      const even = Math.floor(remainder / freeOthers.length);
      let leftover = remainder - even * freeOthers.length;
      freeOthers.forEach((id) => {
        next[id] = even + (leftover > 0 ? 1 : 0);
        if (leftover > 0) leftover -= 1;
      });
    } else if (remainder !== 0) {
      next[userId] = clampedPercent + remainder;
    }

    setLocked((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
    setSplits(next);
  };

  const resetSplits = () => {
    const initial: { [key: string]: number } = {};
    const equal = Math.round(100 / group.users.length);
    group.users.forEach((user) => {
      initial[user._id] = equal;
    });
    setSplits(initial);
    setLocked([]);
  };

  const handleSubmit = () => {
    // Save splits data and proceed
    onComplete();
  };

  return (
    <>
        <div className={"fixed top-0 left-0 w-full z-20"}>
            <div className={"flex justify-between items-center pt-6 px-6 pb-6 bg-black/90 shadow-lg"}>
                <Link href={"/zone"}><ArrowLeft className={"size-5 text-ligr"}/></Link>
                <span>{"Split receipt"}</span>
                <Save className={"size-5 text-transparent"}/>
            </div>
        </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingBottom: 140,
          padding: '20px',
            paddingTop: '70px'
        }}
      >
        <div style={{ textAlign: 'center', padding: '20px 0 30px' }}>
          <div style={{ fontSize: 48, fontWeight: 500, letterSpacing: '-1.2px', color: '#fff' }}>
            {receipt.total.toFixed(2)}€
          </div>
        </div>

        <div
          style={{
            padding: '24px 20px 30px',
            background: '#16151a',
            borderRadius: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 40,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {group.users.map((user) => (
              <PersonSliderRow
                key={user._id}
                user={user}
                percent={splits[user._id]}
                locked={locked.includes(user._id)}
                onChange={(p) => updateSplit(user._id, p)}
                total={receipt.total}
              />
            ))}
          </div>

          {locked.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={resetSplits}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#a0a0a0',
                  fontSize: 13,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Reset split
              </button>
            </div>
          )}
        </div>
      </div>

        <div className={"mx-[16px]"}>
            <Button size={"bl"} onClick={sw}>Switch to split</Button>
        </div>
      <div
        style={{
          display: 'flex',
          gap: 12,
          padding: '16px',
        }}
      >
        <Button onClick={handleSubmit} variant={"secondary"} size={"bl"}>
          Confirm split
        </Button>
      </div>
    </>
  );
}












