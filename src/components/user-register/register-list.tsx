"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Edit, Trash2, Loader2, UserPlus } from "lucide-react";
import { useUsers, useDeleteUser } from "@/hooks/use-users";
import { User, UpdateUserRequest } from "@/types/user";
import RegisterForm from "./register-form";
import EditUserForm from "./edit-user-form";

// Type for Badge variant
type BadgeVariant = "default" | "secondary" | "outline" | "destructive";

const RegisterList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const { data: users = [], isLoading, error, refetch } = useUsers();
  const deleteUserMutation = useDeleteUser();

  const filteredUsers = users.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email &&
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.phone_number.includes(searchTerm) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (phoneNumber: string) => {
    try {
      await deleteUserMutation.mutateAsync(phoneNumber);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleEdit = (user: User) => {
    setUserToEdit(user);
    setIsEditDialogOpen(true);
  };

  const handleUserCreated = () => {
    setIsCreateDialogOpen(false);
    refetch();
  };

  const handleUserUpdated = () => {
    setIsEditDialogOpen(false);
    setUserToEdit(null);
    refetch();
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setUserToEdit(null);
  };

  const getRoleBadgeVariant = (role: string): BadgeVariant => {
    switch (role) {
      case "YDM_Logistics":
        return "default";
      case "YDM_Rider":
        return "secondary";
      case "YDM_Operator":
        return "outline";
      default:
        return "default";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "YDM_Logistics":
        return "YDM Logistics";
      case "YDM_Rider":
        return "YDM Rider";
      case "YDM_Operator":
        return "YDM Operator";
      default:
        return role;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">
          Failed to load users: {error.message}
        </p>
        <Button variant="outline" className="mt-2" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Search and Add User Button */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search users by name, email, phone, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Register New User</DialogTitle>
              <DialogDescription>
                Fill out the form below to register a new user
              </DialogDescription>
            </DialogHeader>
            <RegisterForm onUserCreated={handleUserCreated} />
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogClose}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update the user information below
              </DialogDescription>
            </DialogHeader>
            {userToEdit && (
              <EditUserForm
                user={userToEdit}
                onUserUpdated={handleUserUpdated}
                onCancel={handleEditDialogClose}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Users Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  {searchTerm
                    ? "No users found matching your search."
                    : "No users registered yet."}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.phone_number}>
                  <TableCell className="font-medium">
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell>
                    {user.email || (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>{user.phone_number}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {getRoleLabel(user.role)}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete{" "}
                              <strong>
                                {selectedUser?.first_name}{" "}
                                {selectedUser?.last_name}
                              </strong>
                              ? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                if (selectedUser) {
                                  handleDelete(selectedUser.phone_number);
                                }
                              }}
                              disabled={deleteUserMutation.isPending}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              {deleteUserMutation.isPending ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                "Delete"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Users Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredUsers.length} of {users.length} users
      </div>
    </div>
  );
};

export default RegisterList;
