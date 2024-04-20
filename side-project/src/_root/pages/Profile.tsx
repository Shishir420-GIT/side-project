import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext"

const Profile = () => {
  const { user } = useUserContext();
  const { toast } = useToast()
  const callToast = () => {
    toast({title: "Functionality building in progress!!"})
  }
  return (
    <div>
      <h1>Username : {user.username}</h1>
      <h3>EmailId : {user.email}</h3>
      <h3>Bio : {user.bio}</h3>

      Further page under construction
      <Button onClick={callToast} variant="ghost">
        check status...
      </Button>  
    </div>
  )
}

export default Profile