import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router';
import { Scan, Loader2, X, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { API_ENDPOINTS } from '../utils/constants';

const schema = yup.object().shape({
    name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
    categoryId: yup.string().required('Category is required'),
    expiryDate: yup.date().required('Expiry date is required'),
    barcode: yup.string().required('Barcode is required'),
});

const AddProductPage = () => {
    const [catData, setCatData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [scannedBarcode, setScannedBarcode] = useState('');
    const [scanStatus, setScanStatus] = useState('idle');
    const [scanError, setScanError] = useState('');
    const scannerRef = useRef(null);
    const scannerContainerRef = useRef(null);
    const navigate = useNavigate();

    const { register, setValue, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { name: '', categoryId: '', expiryDate: '', barcode: '' },
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get(API_ENDPOINTS.CATEGORIES);
                setCatData(res.data || []);
            } catch {
                // Optionally handle error
            }
        };
        fetchCategories();
    }, []);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await api.post(API_ENDPOINTS.PRODUCTS, data);
            reset();
            toast.success('Product added successfully!');
            navigate('/products');
        } catch {
            toast.error('Failed to add product');
        } finally {
            setIsLoading(false);
        }
    };

    const initScanner = async () => {
        setScanStatus('initializing');
        setScanError('');
        try {
            const { Html5Qrcode } = await import('html5-qrcode');
            if (scannerRef.current) {
                try {
                    await scannerRef.current.stop();
                } catch(err) { console.log(err) }
                try {
                    await scannerRef.current.clear();
                } catch(err) { console.log(err) }
                scannerRef.current = null;
            }
            const scannerElem = document.getElementById('barcode-scanner');
            if (scannerElem) {
                scannerElem.innerHTML = '';
            }
            scannerRef.current = new Html5Qrcode('barcode-scanner');
            await scannerRef.current.start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: 250 },
                (decodedText) => {
                    setScannedBarcode(decodedText);
                    setValue('barcode', decodedText);
                    setScanStatus('success');
                    setShowScanner(false);
                    if (scannerRef.current) {
                        scannerRef.current.stop().then(() => scannerRef.current.clear());
                        scannerRef.current = null;
                    }
                },
                (errorMessage) => {
                    if (!errorMessage.includes('NotFoundException')) {
                        setScanStatus('error');
                        setScanError(errorMessage);
                    }
                }
            );
            setScanStatus('scanning');
        } catch (err) {
            setScanStatus('error');
            setScanError(err?.message || 'Failed to initialize camera');
        }
    };

    const stopScanner = async () => {
        setShowScanner(false);
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
            } catch { /* ignore error */ }
            try {
                await scannerRef.current.clear();
            } catch { /* ignore error */ }
            scannerRef.current = null;
        }
        const scannerElem = document.getElementById('barcode-scanner');
        if (scannerElem) {
            scannerElem.innerHTML = '';
        }
        setScanStatus('idle');
        setScanError('');
    };

    const handleManualBarcodeChange = (e) => {
        setScannedBarcode(e.target.value);
        setValue('barcode', e.target.value);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg mx-4 relative">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input
                            type="text"
                            {...register('name')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            {...register('categoryId')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select Category</option>
                            {catData?.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                        <input
                            type="date"
                            {...register('expiryDate')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.expiryDate && <p className="mt-1 text-sm text-red-600">{errors.expiryDate.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Barcode</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                {...register('barcode')}
                                value={scannedBarcode}
                                onChange={handleManualBarcodeChange}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Scan or enter barcode"
                            />
                            <button
                                type="button"
                                onClick={() => { setShowScanner(true); initScanner(); }}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            >
                                <Scan className="w-4 h-4" />
                                Scan
                            </button>
                        </div>
                        {errors.barcode && <p className="mt-1 text-sm text-red-600">{errors.barcode.message}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Adding...
                            </span>
                        ) : (
                            'Add Product'
                        )}
                    </button>
                </form>
                {showScanner && (
                    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/90 p-4">
                        <div className="w-full max-w-md bg-white rounded-lg overflow-hidden shadow-2xl">
                            <div className="flex justify-between items-center p-4 border-b">
                                <h3 className="text-lg font-medium">Scan Barcode</h3>
                                <button
                                    onClick={stopScanner}
                                    className="text-gray-500 hover:text-gray-700"
                                    aria-label="Close scanner"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="relative bg-black w-full aspect-square">
                                <div
                                    id="barcode-scanner"
                                    className="w-full h-full"
                                    ref={scannerContainerRef}
                                />
                                {scanStatus !== 'scanning' && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-4">
                                        {scanStatus === 'initializing' && (
                                            <>
                                                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                                                <p>Initializing camera...</p>
                                            </>
                                        )}
                                        {scanStatus === 'success' && (
                                            <>
                                                <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                                                <p className="text-xl font-medium mb-2">Barcode scanned!</p>
                                                <p className="text-sm opacity-80">{scannedBarcode}</p>
                                            </>
                                        )}
                                        {scanStatus === 'error' && (
                                            <>
                                                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                                                <p className="text-center mb-4">{scanError}</p>
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={stopScanner}
                                                        className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={initScanner}
                                                        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                                                    >
                                                        Retry
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="p-4 bg-gray-50 text-center border-t">
                                <p className="text-sm text-gray-600">
                                    {scanStatus === 'scanning'
                                        ? "Point your camera at the barcode"
                                        : scanStatus === 'success'
                                            ? "Scan successful!"
                                            : "Preparing scanner..."}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddProductPage;
