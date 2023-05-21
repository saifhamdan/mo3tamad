interface Model {
  CreatedAt: string;
  UpdatedAt: string;
  CreatedBy: number;
  UpdatedBy: number;
}

interface User extends Model {
  id: number;
  name: string;
  email: string;
  mobile: string;
  password: string;
  roleId: number;
  role: Role;
  active: bool;
  status: string;
  orgId: number;
  org?: Org;
}
