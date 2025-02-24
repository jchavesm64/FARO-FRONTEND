export const checkUserPermissions = (
  currentUserRoles,
  modulesNeeded,
  permissionsNeeded
) => {
  return currentUserRoles.some((rol) =>
    rol?.permisos.some(
      (permiso) =>
        modulesNeeded.includes(permiso?.modulo) &&
        permissionsNeeded.some((perm) => permiso?.[perm])
    )
  );
};
