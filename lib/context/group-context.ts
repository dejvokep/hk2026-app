import {createContext} from "react";
import {defaultGroup, defaultUser, Group, User} from "@/lib/types";

export const GroupContext = createContext<Group>(defaultGroup);