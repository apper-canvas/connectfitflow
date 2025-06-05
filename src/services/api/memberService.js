import memberData from '../mockData/members.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let members = [...memberData];

export const getAll = async () => {
  await delay(300);
  return [...members];
};

export const getById = async (id) => {
  await delay(200);
  const member = members.find(m => m.id === id);
  return member ? { ...member } : null;
};

export const create = async (memberData) => {
  await delay(400);
  const newMember = {
    ...memberData,
    id: Date.now().toString(),
    joinDate: memberData.joinDate || new Date().toISOString().split('T')[0],
    emergencyContact: memberData.emergencyContact || {}
  };
  members.push(newMember);
  return { ...newMember };
};

export const update = async (id, memberData) => {
  await delay(350);
  const index = members.findIndex(m => m.id === id);
  if (index === -1) {
    throw new Error('Member not found');
  }
  members[index] = { ...members[index], ...memberData };
  return { ...members[index] };
};

export const delete_ = async (id) => {
  await delay(250);
  const index = members.findIndex(m => m.id === id);
  if (index === -1) {
    throw new Error('Member not found');
  }
  const deleted = members.splice(index, 1)[0];
  return { ...deleted };
};

// Alias for delete (since delete is a reserved keyword)
export const delete = delete_;