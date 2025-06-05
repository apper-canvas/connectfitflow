import classData from '../mockData/classes.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let classes = [...classData];

export const getAll = async () => {
  await delay(320);
  return [...classes];
};

export const getById = async (id) => {
  await delay(180);
  const classItem = classes.find(c => c.id === id);
  return classItem ? { ...classItem } : null;
};

export const create = async (classData) => {
  await delay(400);
  const newClass = {
    ...classData,
    id: Date.now().toString(),
    enrolled: 0
  };
  classes.push(newClass);
  return { ...newClass };
};

export const update = async (id, classData) => {
  await delay(350);
  const index = classes.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error('Class not found');
  }
  classes[index] = { ...classes[index], ...classData };
  return { ...classes[index] };
};

export const delete_ = async (id) => {
  await delay(250);
  const index = classes.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error('Class not found');
  }
  const deleted = classes.splice(index, 1)[0];
  return { ...deleted };
};

export const delete = delete_;