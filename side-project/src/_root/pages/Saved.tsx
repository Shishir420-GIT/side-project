import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

const Saved = () => {
  const { toast } = useToast()
  const callToast = () => {
    toast({title: "Functionality building in progress!!"})
  }
  return (
    <div className="flex flex-col gap-5 m-5 p-5">
      Saved: page under construction
      <Button onClick={callToast} variant="ghost">
        check status...
      </Button>
    </div>
    
  )
}

export default Saved