import './global.css'
import { Routes, Route } from 'react-router-dom'
import SigninForm from './_auth/forms/SigninForm';
import SignupForm from './_auth/forms/SignupForm';
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout';
import { Toaster } from "@/components/ui/toaster"
import {AllUsers, CreatePost, Explore, Home, LikedPosts, PostDetails, Profile, Saved, UpdateProfile} from './_root/pages'

const App = () => {
  return (
    <main className='flex h-screen'>
      <Routes>
        //Pubic
        <Route element={<AuthLayout />}>
          <Route path='/sign-in' element={<SigninForm/>}/>
          <Route path='/sign-up' element={<SignupForm/>}/>
        </Route>
        //private
        <Route element={<RootLayout />}>
          <Route index element={<Home />}/>
          <Route path="/explore" element={<Explore/>}/>
          <Route path="/saved" element={<Saved/>}/>
          <Route path="/all-users" element={<AllUsers/>}/>
          <Route path="/create-post" element={<CreatePost/>}/>
          <Route path="/update-post/:id" element={<PostDetails/>}/>
          <Route path="/posts/:id" element={<Profile/>}/>
          <Route path="/update-profile/:id" element={<UpdateProfile/>}/>
          <Route path="/LikedPosts" element={<LikedPosts/>}/>
        </Route>
      </Routes>
      <Toaster/>
    </main>
  )
}

export default App