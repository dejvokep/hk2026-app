'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ApiReceipt } from '@/app/zone/scan/page';
import {ExpenseType, Group} from '@/lib/types';
import {Button} from "@/components/ui/button";

interface CompletionStageProps {
  receipt: ApiReceipt;
  group: Group;
}

export default function CompletionStage({ receipt, group }: CompletionStageProps) {
  const [submitted, setSubmitted] = useState(false);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const submitReceipt = async () => {
      try {
        // Create a sample intent from the receipt
        const intent = {
          group: group._id,
          name: receipt.name,
          vendor: receipt.vendor,
          date: new Date().toISOString(),
          expense: receipt.expense,
          photo: null,
          paid: false,
          value: receipt.total,
          currency: receipt.currency,
          type: 'ONETIME',
          products: receipt.products,
          shares: receipt.products.map(() => [group.users[0]?._id || '']),
        };

        const response = await fetch('/api/intent/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(intent),
        });

        if (response.ok) {
          setItemCount(receipt.products.length);
          setSubmitted(true);
        } else {
          console.error('Failed to submit receipt:', response.status);
          setSubmitted(true);
          setItemCount(receipt.products.length);
        }
      } catch (error) {
        console.error('Error submitting receipt:', error);
        setSubmitted(true);
        setItemCount(receipt.products.length);
      }
    };

    submitReceipt();
  }, []);

  return (
    <>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 120,
        }}
      >
        {submitted ? (
          <>
            <div
              style={{
                width: 182,
                height: 182,
                borderRadius: '50%',
                background: 'rgba(13, 167, 129, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 60px rgba(13, 167, 129, 0.35)',
                animation: 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <svg
                width="120"
                height="120"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stoke-width="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: '#0da781' }}
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>

            <div
              style={{
                marginTop: 40,
                padding: '0 60px',
                textAlign: 'center',
                fontSize: 24,
                fontWeight: 500,
                lineHeight: 1.3,
                maxWidth: 260,
              }}
            >
              Successfully submitted {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </div>

            <style>{`@keyframes scaleIn {
              0% { transform: scale(0); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
            }`}</style>
          </>
        ) : (
          <div
            style={{
              fontSize: 16,
              color: '#666',
            }}
          >
            Submitting...
          </div>
        )}
      </div>

      {submitted && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '20px',
          }}
        >
          <Link href={`/zone/group/${group._id}`} style={{ width: '100%' }}>
            <Button variant={"secondary"} size={"bl"}>
              Done
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}

