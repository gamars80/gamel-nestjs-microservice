import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findOneByEmail(email: string): Promise<{
        id: string;
    }>;
    create({ email, password, }: {
        email: string;
        password: string;
    }): Promise<{
        id: string;
    }>;
    validate({ email, password, }: {
        email: string;
        password: string;
    }): Promise<{
        id: string;
    }>;
}
