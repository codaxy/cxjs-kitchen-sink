export const Permission = {
   admin: {
      user: {
         view: {
            code: 'ADMIN_USER_VIEW',
            description: 'View users',
         },
         edit: {
            code: 'ADMIN_USER_EDIT',
            description: 'Create/edit users',
         },
         delete: {
            code: 'ADMIN_USER_DELETE',
            description: 'Delete users',
         },
         resetPassword: {
            code: 'ADMIN_USER_RESET_PASSWORD',
            description: 'Reset passwords',
         },
      },
      role: {
         view: {
            code: 'ADMIN_ROLE_VIEW',
            description: 'View roles',
         },
         edit: {
            code: 'ADMIN_ROLE_EDIT',
            description: 'Edit roles',
         },
      },
   },
};

export const permissionGroups = { admin: 'Administration ' };
