import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUsers,
  getUserByPhone,
  createUser,
  updateUser,
  deleteUser,
} from "@/services/register";
import { User, CreateUserRequest, UpdateUserRequest } from "@/types/user";
import { toast } from "sonner";

const USERS_QUERY_KEY = ["users"];

export const useUsers = () => {
  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: getUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUser = (phoneNumber: string) => {
  return useQuery({
    queryKey: ["user", phoneNumber],
    queryFn: () => getUserByPhone(phoneNumber),
    enabled: !!phoneNumber,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateUserRequest) => createUser(userData),
    onSuccess: (newUser) => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      toast.success(
        `User ${newUser.first_name} ${newUser.last_name} created successfully!`
      );
    },
    onError: (error: Error) => {
      toast.error(`Failed to create user: ${error.message}`);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      phoneNumber,
      userData,
    }: {
      phoneNumber: string;
      userData: UpdateUserRequest;
    }) => updateUser(phoneNumber, userData),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: ["user", updatedUser.phone_number],
      });
      toast.success(
        `User ${updatedUser.first_name} ${updatedUser.last_name} updated successfully!`
      );
    },
    onError: (error: Error) => {
      toast.error(`Failed to update user: ${error.message}`);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (phoneNumber: string) => deleteUser(phoneNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      toast.success("User deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete user: ${error.message}`);
    },
  });
};
