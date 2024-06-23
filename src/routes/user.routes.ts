import { Router } from 'express';

import { CancelFriendshipController } from '@modules/users/useCases/CancelFriendship/CancelFriendshipController';
import { CreateUserController } from '@modules/users/useCases/CreateUser/CreateUserController';
import { GetFriendsController } from '@modules/users/useCases/GetFriends/GetFriendsController';
import { GetUserController } from '@modules/users/useCases/GetUser/GetUserController';
import { UpdateNameController } from '@modules/users/useCases/UpdateName/UpdateNameController';
import { UpdatePasswordController } from '@modules/users/useCases/UpdatePassword/UpdatePasswordController';
import { UploadAvatarController } from '@modules/users/useCases/UploadAvatar/UploadAvatarController';
import { upload } from '@utils/multer';

import { isAuthenticated } from '../middleware/isAuthenticated';

const userRoutes = Router();

const createUserController = new CreateUserController();
const getUserController = new GetUserController();
const cancelFriendshipController = new CancelFriendshipController();
const getFriendsController = new GetFriendsController();
const updateNameController = new UpdateNameController();
const updatePasswordController = new UpdatePasswordController();
const uploadAvatarController = new UploadAvatarController();

userRoutes.post('/', createUserController.handle);
userRoutes.get('/', isAuthenticated, getUserController.handle);
userRoutes.delete(
  '/cancel_friendship',
  isAuthenticated,
  cancelFriendshipController.handle,
);
userRoutes.get('/friends', isAuthenticated, getFriendsController.handle);
userRoutes.patch('/rename', isAuthenticated, updateNameController.handle);
userRoutes.patch(
  '/reset-password',
  isAuthenticated,
  updatePasswordController.handle,
);

userRoutes.patch(
  '/upload_avatar',
  isAuthenticated,
  upload.single('avatar'),
  uploadAvatarController.handle,
);

export { userRoutes };
