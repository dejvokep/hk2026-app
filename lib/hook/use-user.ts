import {useContext} from "react";
import {UserContext} from "@/lib/context/user-context";

export const useUser = () => useContext(UserContext);