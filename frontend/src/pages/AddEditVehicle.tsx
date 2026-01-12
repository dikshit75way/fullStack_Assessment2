import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateVehicleMutation, useUpdateVehicleMutation, useGetVehicleByIdQuery } from '../services/vehicle';
import { Input } from '../components/Input';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const vehicleSchema = yup.object({
    brand: yup.string().required('Brand is required'),
    model: yup.string().required('Model is required'),
    year: yup.number().typeError('Year must be a number').min(1900, 'Invalid year').max(new Date().getFullYear() + 1, 'Invalid year').required('Year is required'),
    plateNumber: yup.string().required('Plate number is required'),
    type: yup.string().required('Type is required'),
    pricePerDay: yup.number().typeError('Price must be a number').positive('Price must be positive').required('Price is required'),
    features: yup.string().ensure(),
    status: yup.string().required('Status is required'),
}).required();

type VehicleFormInputs = yup.InferType<typeof vehicleSchema>;

export const AddEditVehicle = () => {
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;
    const navigate = useNavigate();

    const [imageFile, setImageFile] = useState<File | null>(null);

    const [createVehicle, { isLoading: isCreating }] = useCreateVehicleMutation();
    const [updateVehicle, { isLoading: isUpdating }] = useUpdateVehicleMutation();
    
    const { data: vehicleData } = useGetVehicleByIdQuery(id || '', { skip: !isEditMode });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<VehicleFormInputs>({
        resolver: yupResolver(vehicleSchema),
        defaultValues: {
            brand: '',
            model: '',
            year: new Date().getFullYear(),
            plateNumber: '',
            type: 'Sedan',
            pricePerDay: 0,
            features: '',
            status: 'available'
        }
    });

    useEffect(() => {
        if (vehicleData?.data) {
             const v = vehicleData.data;
             setValue('brand', v.brand);
             setValue('model', v.model);
             setValue('year', v.year);
             setValue('plateNumber', v.plateNumber);
             setValue('type', v.type);
             setValue('pricePerDay', v.pricePerDay);
             setValue('features', v.features?.join(', ') || '');
             setValue('status', v.status as any);
        }
    }, [vehicleData, setValue]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const onSubmit = async (data: VehicleFormInputs) => {
        const form = new FormData();
        form.append('brand', data.brand);
        form.append('model', data.model);
        form.append('year', data.year.toString());
        form.append('plateNumber', data.plateNumber);
        form.append('type', data.type);
        form.append('pricePerDay', data.pricePerDay.toString());
        form.append('status', data.status);
        
        // Handle features array
        if (data.features) {
            const featuresArray = data.features.split(',').map(f => f.trim()).filter(Boolean);
            featuresArray.forEach(f => form.append('features[]', f));
        }

        if (imageFile) {
            form.append('image', imageFile);
        }

        try {
            if (isEditMode && id) {
                await updateVehicle({ id, data: form }).unwrap();
                toast.success('Vehicle updated successfully');
            } else {
                await createVehicle(form).unwrap();
                toast.success('Vehicle created successfully');
            }
            navigate('/admin');
        }   catch (err: any) {
              console.error(err);
              toast.error(err.data?.message || 'Action failed');
            }
    };

    const isLoading = isCreating || isUpdating;

    const pageTitle = isEditMode ? 'Edit Vehicle' : 'Add New Vehicle';
    const submitButtonText = isLoading ? 'Saving...' : (isEditMode ? 'Update Vehicle' : 'Add Vehicle');

    return (
        <div className="max-w-2xl mx-auto">
             <Link to="/admin" className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6 transition">
                <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                {pageTitle}
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                        label="Brand" 
                        {...register('brand')}
                        error={errors.brand?.message}
                    />
                    <Input 
                        label="Model" 
                        {...register('model')}
                        error={errors.model?.message}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                        label="Year" 
                        type="number" 
                        {...register('year')}
                        error={errors.year?.message}
                    />
                    <Input 
                        label="Plate Number" 
                        {...register('plateNumber')}
                        error={errors.plateNumber?.message}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select 
                            {...register('type')}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            {["Sedan", "SUV", "Luxury", "Truck", "Van"].map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
                    </div>
                    <Input 
                        label="Price Per Day ($)" 
                        type="number" 
                        {...register('pricePerDay')}
                        error={errors.pricePerDay?.message}
                    />
                </div>
                
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select 
                        {...register('status')}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="available">Available</option>
                        <option value="rented">Rented</option>
                        <option value="maintenance">Maintenance</option>
                    </select>
                    {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Image</label>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {isEditMode && !imageFile && (
                        <p className="mt-1 text-xs text-gray-500">Leave empty to keep existing image</p>
                    )}
                </div>

                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma separated)</label>
                     <textarea 
                        rows={3}
                        {...register('features')}
                        className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
                            errors.features ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        placeholder="GPS, Bluetooth, Leather Seats..."
                     />
                     {errors.features && <p className="mt-1 text-sm text-red-600">{errors.features.message}</p>}
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {submitButtonText}
                    </button>
                </div>
            </form>
        </div>
    );
};
