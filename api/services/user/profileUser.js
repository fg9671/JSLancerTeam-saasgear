import { getUserById } from '~/repository/user.repository';

export async function getProfileUserById(id) {
  return getUserById(id);
}
