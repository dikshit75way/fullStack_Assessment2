import Vehicle from "./vehicle.schema";
import { type IVehicle, type IFilterVehicles } from "./vehicle.dto";

export const createVehicle = async (data: IVehicle , userId: string | undefined) => {
  return await Vehicle.create({...data, owner: userId});
};

export const getAllVehicles = async (filters: IFilterVehicles = {}) => {
  return await Vehicle.find(filters).lean();
};

export const getVehicleById = async (id: string) => {
  return await Vehicle.findById(id).lean();
};

export const updateVehicle = async (id: string, data: Partial<IVehicle>) => {
  return await Vehicle.findByIdAndUpdate(id, data, { new: true }).lean();
};

export const deleteVehicle = async (id: string) => {
  return await Vehicle.findByIdAndDelete(id).lean();
};
