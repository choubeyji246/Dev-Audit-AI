
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  activeSidebarTab: string;
  isChatDrawerOpen: boolean;
  selectedRepoId: string | null;
}

const initialState: UIState = {
  activeSidebarTab: 'dashboard',
  isChatDrawerOpen: false,
  selectedRepoId: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSidebarTab: (state, action: PayloadAction<string>) => {
      state.activeSidebarTab = action.payload;
    },
    toggleChatDrawer: (state) => {
      state.isChatDrawerOpen = !state.isChatDrawerOpen;
    },
    setSelectedRepo: (state, action: PayloadAction<string | null>) => {
      state.selectedRepoId = action.payload;
    }
  }
});

export const { setSidebarTab, toggleChatDrawer, setSelectedRepo } = uiSlice.actions;
export default uiSlice.reducer;