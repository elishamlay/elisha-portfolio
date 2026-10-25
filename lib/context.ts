"use client";

import { createContext, useContext } from "react";

type Ctx = { run: (cmd: string) => void };

export const TerminalContext = createContext<Ctx>({ run: () => {} });
export const useTerminal = () => useContext(TerminalContext);
