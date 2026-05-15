import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async Thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (filters = {}, thunkAPI) => {
    try {
      const { category, minPrice, maxPrice, rating, search, seller } = filters;
      let queryStr = '?';
      
      if (category) queryStr += `category=${category}&`;
      if (minPrice) queryStr += `minPrice=${minPrice}&`;
      if (maxPrice) queryStr += `maxPrice=${maxPrice}&`;
      if (rating) queryStr += `rating=${rating}&`;
      if (search) queryStr += `search=${search}&`;
      if (seller) queryStr += `seller=${seller}&`;

      const { data } = await api.get(`/products${queryStr}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  'products/fetchDetails',
  async (id, thunkAPI) => {
    try {
      const { data } = await api.get(`/products/${id}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  products: [],
  productDetails: null,
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductDetails: (state) => {
      state.productDetails = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Products
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch Product Details
    builder.addCase(fetchProductDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProductDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.productDetails = action.payload;
    });
    builder.addCase(fetchProductDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearProductDetails } = productsSlice.actions;
export default productsSlice.reducer;
