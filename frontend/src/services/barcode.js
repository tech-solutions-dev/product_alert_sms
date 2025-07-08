import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const barcodeService = {
  scan: async (barcode) => {
    const res = await api.post(API_ENDPOINTS.BARCODE_SCAN, { barcode });
    return res.data.product;
  },
};
