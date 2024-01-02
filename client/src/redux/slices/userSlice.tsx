import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  status: boolean;
  user:string
}

const initialState: UserState = {
  status: false,
  user:"connect"
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<boolean>) => {
      state.status = action.payload;
    },
    setUser: (state, action:PayloadAction<string>) => {
      state.user = action.payload;
    }
  }
});
export const { setStatus , setUser } = userSlice.actions; 
export default userSlice.reducer;
