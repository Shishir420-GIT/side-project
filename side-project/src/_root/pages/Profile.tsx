import { useUserContext } from "@/context/AuthContext"

const Profile = () => {
  const { user } = useUserContext();
  return (
    <div>
      <h1>Username : {user.username}</h1>
      <h3>EmailId : {user.email}</h3>
      <h3>Bio : {user.bio}</h3>    
    </div>
  )
}

export default Profile