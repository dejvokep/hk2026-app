'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {ArrowLeft, Save, Sparkles, X} from 'lucide-react';
import { ApiReceipt } from '@/app/zone/scan/page';
import Link from "next/link";
import {DEFAULT_IN_USE, Group} from "@/lib/types";

function Divider() {
  return <div style={{ height: 1, background: '#e0e0e0', flexShrink: 0 }} />;
}

function ReceiptRow({ name, price, strikethrough, onClick }: { name: string; price: number; strikethrough?: boolean; onClick?: () => void }) {
  const strikeStyle = {
    position: 'absolute' as const,
    left: -2,
    right: -2,
    top: '50%',
    height: 2,
    background: '#000',
    transform: 'translateY(-50%)',
    borderRadius: 1,
    pointerEvents: 'none' as const,
  };

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 16,
        fontWeight: 400,
        color: '#000',
        letterSpacing: '-0.32px',
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: 4,
        padding: onClick ? '4px' : '0px',
        backgroundColor: 'transparent',
        transition: 'background-color 0.2s ease',
      }}
      >
      <span style={{ position: 'relative', display: 'inline-block' }}>
        {name}
        {strikethrough && <span style={strikeStyle} />}
      </span>
      <span style={{ position: 'relative', display: 'inline-block' }}>
        €{price.toFixed(2)}
        {strikethrough && <span style={strikeStyle} />}
      </span>
    </div>
  );
}

function UserSelectionModal({
  productName,
  users,
  selectedUserIds,
  onClose,
  onSave,
}: {
  productName: string;
  users: { _id: string; name: string }[];
  selectedUserIds: string[];
  onClose: () => void;
  onSave: (userIds: string[]) => void;
}) {
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>(selectedUserIds);

  const handleToggleUser = (userId: string) => {
    setLocalSelectedIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'flex-end',
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#16151a',
          width: '100%',
          borderRadius: '16px 16px 0 0',
          padding: '20px',
          maxHeight: '70vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 500, color: '#fff', letterSpacing: '-0.32px' }}>
            Assign &quot;{productName}&quot; to
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 8,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {users.map((user) => (
            <label
              key={user._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 12,
                background: '#242424',
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2a2a30')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#242424')}
            >
              <input
                type="checkbox"
                checked={localSelectedIds.includes(user._id)}
                onChange={() => handleToggleUser(user._id)}
                style={{
                  width: 20,
                  height: 20,
                  cursor: 'pointer',
                  accentColor: '#3b82f6',
                }}
              />
              <span style={{ fontSize: 14, fontWeight: 500, color: '#fff', letterSpacing: '-0.28px' }}>
                {user.name}
              </span>
            </label>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <Button onClick={() => onSave(localSelectedIds)} variant="secondary" size="bl" className="w-full">
            OK
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ReceiptDisplayStage({ receipt, group, sw, complete }: { receipt: ApiReceipt, sw: () => void, complete: () => void, group: Group & { users: { _id: string; name: string }[] } }) {
  const [state, setState] = useState<'initial' | 'suggestion'>('initial');
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
  const [productAssignments, setProductAssignments] = useState<{ [key: number]: string[] }>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleNext = () => {
    setState('suggestion');
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }
    }, 80);
  };

  const handleNo = () => {
    complete();
  };

  const handleYes = () => {
    complete();
  };

  const handleProductClick = (index: number) => {
    setSelectedProductIndex(index);
  };

  const handleSaveAssignments = (userIds: string[]) => {
    if (selectedProductIndex !== null) {
      setProductAssignments((prev) => ({
        ...prev,
        [selectedProductIndex]: userIds,
      }));
    }
    setSelectedProductIndex(null);
  };

  const isSuggestion = state === 'suggestion';
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  const date = now.toLocaleDateString('en-GB');

  return (
    <>
      <div className={"fixed top-0 left-0 w-full z-20"}>
        <div className={"flex justify-between items-center pt-6 px-6 pb-6 bg-black/90 shadow-lg"}>
          <Link href={"/zone"}><ArrowLeft className={"size-5 text-ligr"}/></Link>
          <span>{"Scanned receipt"}</span>
          <Save className={"size-5 text-transparent"}/>
        </div>
      </div>

      <div className={"pt-[70px]"}
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollBehavior: 'smooth',
          paddingBottom: 10,
        }}
      >
        <div style={{
          margin: '17px 11px 0',
          height: 103,
          borderRadius: 16,
          background: 'linear-gradient(to bottom, #2c2c2c, #181818)',
          boxShadow: '0 0 4px -1px rgba(255,245,245,0.3), 0 1px 0 1px #242424, 0 0 4px 0 rgba(0,0,0,0.25)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: 18,
          flexShrink: 0,
        }}>
          <div style={{
            width: 338,
            height: 21,
            borderRadius: 43,
            border: '1px solid #0f0f14',
            background: '#000',
            boxShadow: 'inset 0 0 4px 4px #151515',
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 16,
            boxShadow: 'inset 0 3px 4px -2px rgba(255,255,255,0.25)',
            pointerEvents: 'none',
          }} />
        </div>

        <div style={{
          background: '#fff',
          margin: '-75px 43.67px 0 43.67px',
          borderRadius: '0 0 4px 4px',
          padding: '20px 20px 32px',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '0 0 4px 4px',
            boxShadow: 'inset 0 57px 30.7px -42px black',
            pointerEvents: 'none',
            zIndex: 10,
          }} />

          <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: 31 }}>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-0.32px', color: '#000', whiteSpace: 'nowrap' }}>
                ------------------------------------------------------------------
              </div>
              <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-0.32px', color: '#000', textAlign: 'center', margin: '4px 0' }}>
                Scanned receipt · {time}
              </div>
              <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-0.32px', color: '#000', whiteSpace: 'nowrap' }}>
                ------------------------------------------------------------------
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {[
                ['Merchant', receipt.vendor],
                ['Date', date],
                ['Time', time],
                ['Total', `${receipt.total.toFixed(2)}€`]
              ].map(([label, val], i, arr) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 400, color: '#000', letterSpacing: '-0.32px' }}>
                    <span>{label}</span><span>{val}</span>
                  </div>
                  {i < arr.length - 1 && <Divider />}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {receipt.products.map((item, i) => (
                <div key={item.name + i}>
                  <ReceiptRow
                    name={item.name}
                    price={item.price}
                    onClick={() => handleProductClick(i)}
                  />
                  {productAssignments[i] && productAssignments[i].length > 0 && (
                    <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                      Assigned to {productAssignments[i].length} person(s)
                    </div>
                  )}
                  {i < receipt.products.length - 1 && <Divider />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          margin: '40px 21px 0',
          background: '#16151a',
          borderRadius: 18,
          padding: 20,
          display: 'flex',
          gap: 12,
          alignItems: 'flex-start',
          opacity: isSuggestion ? 1 : 0,
          transform: isSuggestion ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
          pointerEvents: isSuggestion ? 'auto' : 'none',
          borderLeft: '3px solid #0097FA',
        }}>
          <Sparkles size={20} color="#fff" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-0.32px', color: '#fff', lineHeight: 1.45, flex: 1 }}>
            You never split alcohol with Jan before. Assign &quot;<strong style={{ fontWeight: 600 }}>Víno červené</strong>&quot; only to Martin?
          </span>
        </div>

        <div style={{ height: 16 }} />
      </div>

      <div className={"mx-[16px]"}>
        <Button size={"bl"} onClick={sw}>Switch to sharing</Button>
      </div>

      <div style={{
        display: 'flex',
        gap: 12,
        padding: '16px',
      }}>
        {!isSuggestion ? (
          <Button onClick={DEFAULT_IN_USE ? handleNext : handleYes} variant={"secondary"} size={"bl"} className="w-full">Next</Button>
        ) : (
          <>
            <Button onClick={handleYes} variant="secondary" size={"bl"} className="flex-1">Yes</Button>
            <Button onClick={handleNo} size={"bl"} className="flex-1">No</Button>
          </>
        )}
      </div>

      {selectedProductIndex !== null && (
        <UserSelectionModal
          productName={receipt.products[selectedProductIndex].name}
          users={group.users}
          selectedUserIds={productAssignments[selectedProductIndex] || []}
          onClose={() => setSelectedProductIndex(null)}
          onSave={handleSaveAssignments}
        />
      )}
    </>
  );
}

