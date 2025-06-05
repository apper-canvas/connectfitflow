// Equipment service using ApperClient for database operations
const TABLE_NAME = 'equipment';

// All fields available in the equipment table
const ALL_FIELDS = [
  'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
  'category', 'purchase_date', 'last_maintenance', 'next_maintenance', 'status', 'location', 'notes'
];

// Only updateable fields (excluding System and ReadOnly fields)
const UPDATEABLE_FIELDS = [
  'Name', 'category', 'purchase_date', 'last_maintenance', 'next_maintenance', 'status', 'location', 'notes'
];

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const getAll = async () => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: ALL_FIELDS,
      orderBy: [
        {
          fieldName: "CreatedOn",
          SortType: "DESC"
        }
      ]
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response || !response.data || response.data.length === 0) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching equipment:", error);
    throw error;
  }
};

export const getById = async (recordId) => {
  try {
    const apperClient = getApperClient();
    const params = {
      fields: ALL_FIELDS
    };
    
    const response = await apperClient.getRecordById(TABLE_NAME, recordId, params);
    
    if (!response || !response.data) {
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching equipment with ID ${recordId}:`, error);
    return null;
  }
};

export const create = async (equipmentData) => {
  try {
    const apperClient = getApperClient();
    
    // Filter data to only include updateable fields
    const filteredData = {};
    UPDATEABLE_FIELDS.forEach(field => {
      if (equipmentData[field] !== undefined) {
        filteredData[field] = equipmentData[field];
      }
    });
    
    const params = {
      records: [filteredData]
    };
    
    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (response && response.success && response.results && response.results.length > 0) {
      const successfulResult = response.results.find(result => result.success);
      if (successfulResult) {
        return successfulResult.data;
      }
    }
    
    throw new Error("Failed to create equipment");
  } catch (error) {
    console.error("Error creating equipment:", error);
    throw error;
  }
};

export const update = async (id, equipmentData) => {
  try {
    const apperClient = getApperClient();
    
    // Filter data to only include updateable fields
    const filteredData = { Id: id };
    UPDATEABLE_FIELDS.forEach(field => {
      if (equipmentData[field] !== undefined) {
        filteredData[field] = equipmentData[field];
      }
    });
    
    const params = {
      records: [filteredData]
    };
    
    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (response && response.success && response.results && response.results.length > 0) {
      const successfulResult = response.results.find(result => result.success);
      if (successfulResult) {
        return successfulResult.data;
      }
    }
    
    throw new Error("Failed to update equipment");
  } catch (error) {
    console.error("Error updating equipment:", error);
    throw error;
  }
};

export const delete_ = async (id) => {
  try {
    const apperClient = getApperClient();
    const params = {
      RecordIds: [id]
    };
    
    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    
    if (response && response.success) {
      return true;
    }
    
    throw new Error("Failed to delete equipment");
  } catch (error) {
    console.error("Error deleting equipment:", error);
throw error;
  }
};