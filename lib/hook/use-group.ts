import {useContext} from "react";
import {GroupContext} from "@/lib/context/group-context";

export const useGroup = () => useContext(GroupContext);