import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findOneByEmail(email: string): Promise<User>;
    create(email: string, password: string): Promise<User>;
    validate(email: string, password: string): Promise<User>;
}
