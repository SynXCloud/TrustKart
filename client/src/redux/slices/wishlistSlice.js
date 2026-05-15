import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Fetch wishlist
export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (_, thunkAPI) => {
  try {
    const { data } = await api.get('/users/profile');
    return data.wishlist; // getUserProfile returns wishlist populated
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Toggle wishlist item
export const toggleWishlistItem = createAsyncThunk('wishlist/toggleItem', async (productId, thunkAPI) => {
  try {
    const { data } = await api.post('/users/wishlist', { productId });
    return data; // Returns updated populated wishlist array
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlistState: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    // Fetch Wishlist
    builder.addCase(fetchWishlist.pending, (state) => { state.loading = true; });
    builder.addCase(fetchWishlist.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchWishlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Toggle Wishlist Item
    builder.addCase(toggleWishlistItem.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export const { clearWishlistState } = wishlistSlice.actions;
export default wishlistSlice.reducer;
