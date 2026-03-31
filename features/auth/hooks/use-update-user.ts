// "use client";

// import { api } from "@/trpc/react";

// export const useUpdateUser = () => {
//   const utils = api.useUtils();
//   const updateUser = api.user.updateUser.useMutation({
//     onSuccess: async () => {
//       console.log("User updated successfully");
//       void utils.user.getUser.invalidate();
//     },
//     onError: (error) => {
//       console.error("Error updating user:", error);
//     },
//   });

//   return updateUser;
// };
