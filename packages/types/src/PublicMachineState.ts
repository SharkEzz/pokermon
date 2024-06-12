export interface PublicMachineState {
  users: string[];
  admin: string;
  canStart: boolean;
  isAdmin: boolean;
  currentUser: string;
  state: string;
}
