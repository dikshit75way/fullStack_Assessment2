import Vehicle from "./vehicle.schema";
import { type IVehicle, type IFilterVehicles } from "./vehicle.dto";

import Booking from "../booking/booking.schema";

export const createVehicle = async (data: IVehicle , userId: string | undefined) => {
  return await Vehicle.create({...data, owner: userId});
};

export const getAllVehicles = async (filters: IFilterVehicles = {}) => {
  const { startDate, endDate, ...otherFilters } = filters;
  
  const query: any = { ...otherFilters };

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Find bookings that overlap with the requested period
    const overlaps = await Booking.find({
      status: { $in: ["confirmed", "active", "pending"] },
      $or: [
        { startDate: { $lt: end }, endDate: { $gt: start } },
      ],
    }).select("vehicleId");

    const bookedVehicleIds = overlaps.map(b => b.vehicleId);
    
    // Exclude vehicles that are already booked
    query._id = { $nin: bookedVehicleIds };
  }

  const vehicles = await Vehicle.find(query).lean();
  const now = new Date();

  const vehiclesWithStatus = await Promise.all(vehicles.map(async (vehicle) => {
    const activeBooking = await Booking.findOne({
      vehicleId: vehicle._id,
      status: { $in: ["confirmed", "active"] },
      startDate: { $lte: now },
      endDate: { $gte: now },
    });
    return { ...vehicle, isCurrentlyRented: !!activeBooking };
  }));

  return vehiclesWithStatus;
};

export const getVehicleById = async (id: string) => {
  const vehicle = await Vehicle.findById(id).lean();
  if (!vehicle) return null;

  const now = new Date();
  const activeBooking = await Booking.findOne({
    vehicleId: vehicle._id,
    status: { $in: ["confirmed", "active"] },
    startDate: { $lte: now },
    endDate: { $gte: now },
  });

  return { ...vehicle, isCurrentlyRented: !!activeBooking };
};

export const updateVehicle = async (id: string, data: Partial<IVehicle>) => {
  return await Vehicle.findByIdAndUpdate(id, data, { new: true }).lean();
};

export const deleteVehicle = async (id: string) => {
  return await Vehicle.findByIdAndDelete(id).lean();
};
