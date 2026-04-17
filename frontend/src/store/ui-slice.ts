import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Breadcrumb {
  label: string;
  path?: string;
}

// Define a type for the slice state
interface UIState {
  breadcrumbs: Breadcrumb[];
}

// Define the initial state using that type
const initialState: UIState = {
  breadcrumbs: [],
};

export const uiSlice = createSlice({
  name: 'counter',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    ChangeBreadcrumb: (state, action: PayloadAction<Breadcrumb[]>) => {
      state.breadcrumbs = action.payload;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;
