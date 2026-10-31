// Shared service catalogue used by the Home, Services and Book a Ride pages.
export const SERVICES = [
  {
    id: 'economy',
    icon: '🚕',
    name: 'Economy',
    description: 'Affordable everyday rides for up to 4 passengers.',
    baseFare: 50,
    perKm: 12,
    maxPassengers: 4,
  },
  {
    id: 'premium',
    icon: '🚘',
    name: 'Premium Sedan',
    description: 'Comfortable sedans with top-rated drivers for business or leisure.',
    baseFare: 90,
    perKm: 18,
    maxPassengers: 4,
  },
  {
    id: 'suv',
    icon: '🚙',
    name: 'SUV / Family',
    description: 'Spacious SUVs for groups and families with extra luggage.',
    baseFare: 120,
    perKm: 22,
    maxPassengers: 6,
  },
  {
    id: 'airport',
    icon: '✈️',
    name: 'Airport Transfer',
    description: 'On-time pickups and drops with flight tracking and meet & greet.',
    baseFare: 150,
    perKm: 20,
    maxPassengers: 4,
  },
  {
    id: 'outstation',
    icon: '🛣️',
    name: 'Outstation',
    description: 'One-way or round trips to nearby cities at fixed, transparent fares.',
    baseFare: 300,
    perKm: 14,
    maxPassengers: 4,
  },
  {
    id: 'rental',
    icon: '⏱️',
    name: 'Hourly Rental',
    description: 'Keep a cab with you for hours — ideal for meetings and errands.',
    baseFare: 250,
    perKm: 10,
    maxPassengers: 4,
  },
];

export const getServiceById = (id) => SERVICES.find((s) => s.id === id);
