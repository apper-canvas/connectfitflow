// Member service using ApperClient for database operations
const TABLE_NAME = 'member';

// All fields available in the member table
const ALL_FIELDS = [
  'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
  'first_name', 'last_name', 'email', 'phone', 'membership_type', 'status', 'join_date', 'notes'
];

// Only updateable fields (excluding System and ReadOnly fields)
const UPDATEABLE_FIELDS = [
  'Name', 'first_name', 'last_name', 'email', 'phone', 'membership_type', 'status', 'join_date', 'notes'
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
    console.error("Error fetching members:", error);
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
    console.error(`Error fetching member with ID ${recordId}:`, error);
    return null;
  }
};

export const create = async (memberData) => {
  try {
    const apperClient = getApperClient();
    
    // Filter data to only include updateable fields
    const filteredData = {};
    UPDATEABLE_FIELDS.forEach(field => {
      if (memberData[field] !== undefined) {
        filteredData[field] = memberData[field];
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
    
    throw new Error("Failed to create member");
  } catch (error) {
    console.error("Error creating member:", error);
    throw error;
  }
};

export const update = async (id, memberData) => {
  try {
    const apperClient = getApperClient();
    
    // Filter data to only include updateable fields
    const filteredData = { Id: id };
    UPDATEABLE_FIELDS.forEach(field => {
      if (memberData[field] !== undefined) {
        filteredData[field] = memberData[field];
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
    
    throw new Error("Failed to update member");
  } catch (error) {
    console.error("Error updating member:", error);
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
    
    throw new Error("Failed to delete member");
  } catch (error) {
    console.error("Error deleting member:", error);
    throw error;
  }
};

// Alias for delete (since delete is a reserved keyword)
export { delete_ as deleteMember };