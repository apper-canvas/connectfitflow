import equipmentData from '../mockData/equipment.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let equipment = [...equipmentData];

export const getAll = async () => {
  await delay(350);
  return [...equipment];
};

export const getById = async (id) => {
  await delay(200);
  const item = equipment.find(e => e.id === id);
  return item ? { ...item } : null;
};

export const create = async (equipmentData) => {
  await delay(450);
  const newEquipment = {
    ...equipmentData,
    id: Date.now().toString(),
    purchaseDate: equipmentData.purchaseDate || new Date().toISOString().split('T')[0],
    lastMaintenance: equipmentData.lastMaintenance || new Date().toISOString().split('T')[0],
    nextMaintenance: equipmentData.nextMaintenance || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  };
  equipment.push(newEquipment);
  return { ...newEquipment };
};

export const update = async (id, equipmentData) => {
  await delay(300);
  const index = equipment.findIndex(e => e.id === id);
  if (index === -1) {
    throw new Error('Equipment not found');
  }
  equipment[index] = { ...equipment[index], ...equipmentData };
  return { ...equipment[index] };
};

export const delete_ = async (id) => {
  await delay(280);
  const index = equipment.findIndex(e => e.id === id);
  if (index === -1) {
    throw new Error('Equipment not found');
  }
  const deleted = equipment.splice(index, 1)[0];
  return { ...deleted };
};

export const delete = delete_;