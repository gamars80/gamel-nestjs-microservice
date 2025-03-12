import { Role } from './user.enum';
export declare class User {
    id: string;
    email: string;
    password: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}
