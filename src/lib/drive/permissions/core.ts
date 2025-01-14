interface Permission {
  granted: boolean;
  details?: {
    userId: string;
    resourceId: string;
    level: 'read' | 'write' | 'admin';
  };
  error?: string;
}

interface ValidationResult {
  success: boolean;
  message?: string;
}

export const validateDriveOperation = async (
  userId: string, 
  resourceId: string, 
  operation: string
): Promise<Permission> => {
  try {
    const permission = await checkBasePermission(userId, resourceId);
    const operationAllowed = await validateSpecificOperation(operation, permission);
    
    return {
      granted: operationAllowed.success,
      details: permission,
      ...(operationAllowed.message && { error: operationAllowed.message })
    };
  } catch (error) {
    console.error('Permission validation error:', error);
    return {
      granted: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

const checkBasePermission = async (
  userId: string, 
  resourceId: string
): Promise<Permission['details']> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    userId,
    resourceId,
    level: 'read'
  };
};

const validateSpecificOperation = async (
  operation: string,
  permission: Permission['details']
): Promise<ValidationResult> => {
  if (!permission) {
    return { success: false, message: 'No permission details available' };
  }

  switch (operation) {
    case 'read':
      return { 
        success: ['read', 'write', 'admin'].includes(permission.level) 
      };
    case 'write':
      return { 
        success: ['write', 'admin'].includes(permission.level) 
      };
    case 'admin':
      return { 
        success: permission.level === 'admin' 
      };
    default:
      return { 
        success: false, 
        message: `Unknown operation: ${operation}` 
      };
  }
};

export const checkPermission = validateDriveOperation;
export const validateOperation = validateSpecificOperation;