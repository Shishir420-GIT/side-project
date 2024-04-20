import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

const LikedPosts = () => {
  const { toast } = useToast()
  const callToast = () => {
    toast({title: "Functionality building in progress!!"})
  }
  return (
    <div className="flex flex-col gap-5 m-5 p-5">
      LikedPost: page under construction
      <Button onClick={callToast} variant="ghost">
        check status...
      </Button>
    </div>
    
  )
}

export default LikedPosts