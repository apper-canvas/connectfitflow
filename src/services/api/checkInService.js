import checkInData from '../mockData/checkIns.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let checkIns = [...checkInData];

export const getAll = async () => {
  await delay(250);
  return [...checkIns].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const getById = async (id) => {
  await delay(150);
  const checkIn = checkIns.find(c => c.id === id);
  return checkIn ? { ...checkIn } : null;
};

export const create = async (checkInData) => {
  await delay(300);
  const newCheckIn = {
    ...checkInData,
    id: Date.now().toString(),
    timestamp: checkInData.timestamp || new Date().toISOString()
  };
  checkIns.push(newCheckIn);
  return { ...newCheckIn };
};

export const update = async (id, checkInData) => {
  await delay(280);
  const index = checkIns.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error('Check-in not found');
  }
  checkIns[index] = { ...checkIns[index], ...checkInData };
  return { ...checkIns[index] };
};

export const delete_ = async (id) => {
  await delay(200);
  const index = checkIns.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error('Check-in not found');
  }
  const deleted = checkIns.splice(index, 1)[0];
  return { ...deleted };
};

export const delete = delete_;