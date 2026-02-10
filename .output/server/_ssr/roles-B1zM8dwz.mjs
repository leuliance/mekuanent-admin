function isSuperAdmin(role) {
  return role === "super_admin";
}
function canDelete(role) {
  return role === "super_admin";
}
export {
  canDelete as c,
  isSuperAdmin as i
};
