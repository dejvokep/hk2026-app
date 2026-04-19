'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {ArrowLeft, Plus, Save, Sparkles} from 'lucide-react';
import { SWRFacade } from '@/components/swr-facade';
import useSWRFetch from '@/lib/hook/use-swr-fetch';
import Container from '@/components/container';
import {Avatar, AvatarGroup, AvatarImage} from "@/components/ui/avatar";
import {Group} from "@/lib/types";
import Link from "next/link";

const SUGGESTED_GROUP_ID = '69e39ad3fe6aa2cfdbc80c7b';

export default function GroupSelectionStage({
  onGroupSelected,
}: {
  onGroupSelected: (group: Group) => void;
}) {
  const [selectedGroupId, setSelectedGroupId] = useState<Group | null>(null);
  const groupsRes = useSWRFetch<Group[]>('/group/list');
  const router = useRouter();

  const handleNext = () => {
    if (selectedGroupId) {
      onGroupSelected(selectedGroupId);
    }
  };

  return (
    <>
        <div className={"flex justify-between items-center pt-[24px] px-[24px]"}>
            <ArrowLeft className={"size-5 text-ligr"} onClick={() => router.back()}/>
            <span>{"Select a group"}</span>
            <Save className={"size-5 text-transparent"}/>
        </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <SWRFacade
          res={groupsRes}
          success={(groups) => {
            // Pre-select suggested group on first load
            if (!selectedGroupId) {
              const suggestedGroup = groups.find((g) => g._id === SUGGESTED_GROUP_ID);
              if (suggestedGroup) {
                setTimeout(() => setSelectedGroupId(suggestedGroup), 0);
              } else if (groups.length > 0) {
                setTimeout(() => setSelectedGroupId(groups[0]), 0);
              }
            }

            return (
              <div className={"grid-cols-2"} style={{ display: 'grid', gap: 8 }}>
                  <Container className={"aspect-square grid place-items-center bg-[rgba(22,21,26,0.5)] border-[1px] border-[rgba(22,21,26,1)] border-dashed"}>
                      <Link href={"/zone/group/new"}><div className={"text-ligr"}>
                          <Plus className={"size-4 mx-auto"}/>
                          <p className={"text-[12px]"}>Create new</p>
                      </div></Link>
                  </Container>
                {groups.map((group) => (
                  <Container
                    key={group._id}
                    onClick={() => setSelectedGroupId(group)}
                    className={`flex flex-col justify-between aspect-square cursor-pointer transition-all text-white ${
                      selectedGroupId?._id === group._id
                        ? 'border-[0.5px] border-white '
                        : 'bg-[#16151a] border-[#242424] hover:bg-[#1f1e24]'
                    }`}
                  >
                          <h2 className={"text-[24px]"}>{group.name}</h2>
                          <div className={"flex gap-1 items-center"}>
                              <AvatarGroup className={"*:data-[slot=avatar]:ring-0"}>
                                  {group.users.slice(0, 4).map(user => <Avatar key={user._id} className={"ring-0 size-6"}>
                                      <AvatarImage src={`/pfp/${user._id}.svg`} height={24} width={24}/>
                                  </Avatar>)}
                              </AvatarGroup>
                              {group.users.length > 4 && <p className={"font-bold text-[12px] text-[#A4A6B3]"}>+{group.users.length - 4} more</p>}
                          </div>
                  </Container>
                ))}
              </div>
            );
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          gap: 12,
          padding: '16px',
          background: '#000',
        }}
      >
        <Button onClick={handleNext} disabled={!selectedGroupId} variant={"secondary"} size={"bl"}>
          Next
        </Button>
      </div>
    </>
  );
}









