export interface IFirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  providerId: string;
  phoneNumber: string | null;
}

export interface IUser extends IFirebaseUser {
  fullName: string;
  age: number;
  gender: string;
  address: string | null;
  avatar: string;
  roles: string[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
