
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  activeSidebarTab: string;
  isChatDrawerOpen: boolean;
  selectedRepoId: string | null;
  repos: any[];
}

const initialState: UIState = {
  activeSidebarTab: 'dashboard',
  isChatDrawerOpen: false,
  selectedRepoId: null,
  repos: [],
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
    ,
    setRepos: (state, action: PayloadAction<any[]>) => {
      state.repos = action.payload;
    }
  }
});

export const { setSidebarTab, toggleChatDrawer, setSelectedRepo, setRepos } = uiSlice.actions;
export default uiSlice.reducer;