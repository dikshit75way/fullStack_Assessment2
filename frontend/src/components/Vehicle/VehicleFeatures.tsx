
import { CheckCircle } from 'lucide-react';

interface VehicleFeaturesProps {
    features?: string[];
}

export const VehicleFeatures = ({ features }: VehicleFeaturesProps) => {
    return (
        <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Features</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {features && features.length > 0 ? (
                    features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-gray-600">
                            <CheckCircle size={16} className="mr-2 text-green-500" /> {feature}
                        </li>
                    ))
                ) : (
                    <li className="text-gray-500 italic">No specific features listed.</li>
                )}
            </ul>
        </div>
    );
};
