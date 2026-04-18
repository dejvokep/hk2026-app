import {createContext} from "react";
import {defaultUser, User} from "@/lib/types";

export const UserContext = createContext<User>(defaultUser);