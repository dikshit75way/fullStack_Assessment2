import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateVehicleMutation, useUpdateVehicleMutation, useGetVehicleByIdQuery } from '../services/vehicle';
import { Input } from '../components/Input';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AddEditVehicle = () => {
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        plateNumber: '',
        type: 'Sedan',
        pricePerDay: 0,
        features: '',
        status: 'available'
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [createVehicle, { isLoading: isCreating }] = useCreateVehicleMutation();
    const [updateVehicle, { isLoading: isUpdating }] = useUpdateVehicleMutation();
    
    // Fetch vehicle data if in edit mode
    const { data: vehicleData } = useGetVehicleByIdQuery(id || '', { skip: !isEditMode });

    useEffect(() => {
        if (vehicleData?.data) {
             const v = vehicleData.data;
             setFormData({
                 brand: v.brand,
                 model: v.model,
                 year: v.year,
                 plateNumber: v.plateNumber,
                 type: v.type,
                 pricePerDay: v.pricePerDay,
                 features: v.features?.join(', ') || '',
                 status: v.status
             });
        }
    }, [vehicleData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const form = new FormData();
        form.append('brand', formData.brand);
        form.append('model', formData.model);
        form.append('year', formData.year.toString());
        form.append('plateNumber', formData.plateNumber);
        form.append('type', formData.type);
        form.append('pricePerDay', formData.pricePerDay.toString());
        form.append('status', formData.status);
        
        // Handle features array
        const featuresArray = formData.features.split(',').map(f => f.trim()).filter(Boolean);
        featuresArray.forEach(f => form.append('features[]', f));

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
              toast.error(err.data?.message || 'Registration failed');
            }
    };

    const isLoading = isCreating || isUpdating;

    return (
        <div className="max-w-2xl mx-auto">
             <Link to="/admin" className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6 transition">
                <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                {isEditMode ? 'Edit Vehicle' : 'Add New Vehicle'}
            </h1>

            <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                        label="Brand" 
                        name="brand" 
                        value={formData.brand} 
                        onChange={handleChange} 
                        required 
                    />
                    <Input 
                        label="Model" 
                        name="model" 
                        value={formData.model} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                        label="Year" 
                        name="year" 
                        type="number" 
                        value={formData.year} 
                        onChange={handleChange} 
                        required 
                    />
                    <Input 
                        label="Plate Number" 
                        name="plateNumber" 
                        value={formData.plateNumber} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select 
                            name="type" 
                            value={formData.type} 
                            onChange={handleChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            {["Sedan", "SUV", "Luxury", "Truck", "Van"].map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                    <Input 
                        label="Price Per Day ($)" 
                        name="pricePerDay" 
                        type="number" 
                        value={formData.pricePerDay} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select 
                        name="status" 
                        value={formData.status} 
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="available">Available</option>
                        <option value="rented">Rented</option>
                        <option value="maintenance">Maintenance</option>
                    </select>
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
                        name="features"
                        rows={3}
                        value={formData.features}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="GPS, Bluetooth, Leather Seats..."
                     />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {isLoading ? 'Saving...' : (isEditMode ? 'Update Vehicle' : 'Add Vehicle')}
                    </button>
                </div>
            </form>
        </div>
    );
};
