import { hash } from 'bcrypt';
// one - way encryption
//use compare (currentdata, encrypted - data) for comparison
export async function hashPassword(password: string) {
  return await hash(password, 10);
}
