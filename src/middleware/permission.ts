export default (permissionName: string) => {
  return (req: any, res: any, next: any) => {
    try {
      const hasPermissn = req.admin.permissions.find(
        (perm: string) => permissionName === perm
      );

      if (!hasPermissn)
        return res
          .status(403)
          .send({ message: "Admin doesn't have the required permission" });

      next();
    } catch (err: any) {
      next(new Error("Error in determining permission: " + err.message));
    }
  };
};
