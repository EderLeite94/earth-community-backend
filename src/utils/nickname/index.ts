import Users, { IUsers } from '../../models/users/index';

const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export const generateUniqueNickname = async (firstName: string, surname: string): Promise<string> => {
  const baseNickname = `${firstName}${surname}`;
  let nickname = baseNickname;
  let unique = false;
  let counter = 0;

  while (!unique && counter < 100) {
    const existingUser = await Users.findOne({ 'info.nickName': nickname });

    if (!existingUser) {
      unique = true;
    } else {
      // Adicionar números e letras ao nickname
      let randomString = '';
      const randomNumber = Math.floor(Math.random() * 100000);
      for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters[randomIndex];
      }

      nickname = `${baseNickname}-${randomString}${randomNumber}`;
    }

    counter++;
  }

  if (!unique) {
    throw new Error('Failed to generate a unique nickname');
  }

  return nickname;
};
