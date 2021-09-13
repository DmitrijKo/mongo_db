class PermissionDenied extends Error {
  constructor() {
    super(...arguments);
  }
}

export { PermissionDenied };
