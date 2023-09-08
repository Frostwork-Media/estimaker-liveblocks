import { create } from "zustand";

type ClientStore = {
  /**
   * Whether the floating popover is open or not.
   */
  floatingPopoverOpen: boolean;
  /**
   * Mouse Position of the floating popover.
   */
  floatingPopoverMousePosition: { x: number; y: number } | null;
};

const initialState: ClientStore = {
  floatingPopoverOpen: false,
  floatingPopoverMousePosition: null,
};

export const useClientStore = create<ClientStore>()((_set) => initialState);
