import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: async (userData) => {
      try {
        const res = await fetch("/api/users/update", {
          method: "Post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
        
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to update profile");
        }
        
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
  
  return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile;