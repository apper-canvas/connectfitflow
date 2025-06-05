// Check-in service using ApperClient for database operations
const TABLE_NAME = 'check_in';

// All fields available in the check_in table
const ALL_FIELDS = [
  'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
  'timestamp', 'method', 'type', 'member_id'
];

// Only updateable fields (excluding System and ReadOnly fields)
const UPDATEABLE_FIELDS = [
  'Name', 'timestamp', 'method', 'type', 'member_id'
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
          fieldName: "timestamp",
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
    console.error("Error fetching check-ins:", error);
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
    console.error(`Error fetching check-in with ID ${recordId}:`, error);
    return null;
  }
};

export const create = async (checkInData) => {
  try {
    const apperClient = getApperClient();
    
    // Filter data to only include updateable fields
    const filteredData = {};
    UPDATEABLE_FIELDS.forEach(field => {
      if (checkInData[field] !== undefined) {
        filteredData[field] = checkInData[field];
      }
    });
    
    // Ensure timestamp is in proper DateTime format
    if (filteredData.timestamp) {
      filteredData.timestamp = new Date(filteredData.timestamp).toISOString();
    }
    
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
    
    throw new Error("Failed to create check-in");
  } catch (error) {
    console.error("Error creating check-in:", error);
    throw error;
  }
};

export const update = async (id, checkInData) => {
  try {
    const apperClient = getApperClient();
    
    // Filter data to only include updateable fields
    const filteredData = { Id: id };
    UPDATEABLE_FIELDS.forEach(field => {
      if (checkInData[field] !== undefined) {
        filteredData[field] = checkInData[field];
      }
    });
    
    // Ensure timestamp is in proper DateTime format
    if (filteredData.timestamp) {
      filteredData.timestamp = new Date(filteredData.timestamp).toISOString();
    }
    
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
    
    throw new Error("Failed to update check-in");
  } catch (error) {
    console.error("Error updating check-in:", error);
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
    
    throw new Error("Failed to delete check-in");
  } catch (error) {
    console.error("Error deleting check-in:", error);
throw error;
  }
};

export { delete_ as delete };