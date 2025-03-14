import { Observable } from 'rxjs';

export interface UserServiceGrpc {
  findOneByEmail(data: { email: string }, metadata: any): Observable<{ id: string }>;
  createUser(data: { email: string; password: string }, metadata: any): Observable<{ id: string }>;
}