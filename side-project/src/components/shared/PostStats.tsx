import { Models } from "appwrite"
import { Loader } from "./Loader";
import { checkIsLiked } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations";

type PostStatsProps = {
    post?: Models.Document;
    userId: string;
}
const PostStats = ( { post, userId }: PostStatsProps) => {

    const likesList = post?.likes.map((user: Models.Document) => user.$id)
    
    const [likes, setLikes] = useState(likesList);
    const [isSaved, setIsSaved] = useState(false);
    const { mutate: likePost } = useLikePost()
    const { mutate: savePost, isPending: isSaving } = useSavePost()
    const { mutate: deleteSavedPost, isPending: isDeleting} = useDeleteSavedPost()

    const { data: currentUser } = useGetCurrentUser()

    const savedRecord = currentUser?.save.find(
        (record: Models.Document) => record.post.$id === post?.$id
    );

    useEffect(() => {
        setIsSaved(!!savedRecord)
    },[currentUser])

    const handleLikePost = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        e.stopPropagation();
        let newLikes = [...likes]
        const hasLiked = newLikes.includes(userId);
        if(hasLiked){
            newLikes = newLikes.filter((id) => id !== userId);
        }
        else{
            newLikes.push(userId)
        }
        setLikes(newLikes)
        likePost({ postId: post?.$id || '', likesArray: newLikes})

    }
    const handleSavePost = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        e.stopPropagation();

        if(savedRecord){
            setIsSaved(false)
            deleteSavedPost(savedRecord.$id);
            return
        }
        savePost({ postId: post?.$id || '', userId: userId})
        setIsSaved(true)

    }
    
    return (
    <div className="flex justify-between items-center z-20">
        <div className="flex gap-2 mr-5">
            <img
                src={`${checkIsLiked(likes, userId)
                     ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}`}
                alt="Like"
                width={20} height={20}
                onClick= {handleLikePost}
                className="cursor-pointer" />
            <p className="small-medium lg:base-medium">{likes.length}</p>
        </div>
        <div className="flex gap-2 mr-5">
            { isSaving || isDeleting ? <Loader/> : <img
                src={`${isSaved
                ? "/assets/icons/saved.svg": "/assets/icons/save.svg"}`}
                alt="save"
                width={20} height={20}
                onClick= {handleSavePost}
                className="cursor-pointer" />}
        </div>

    </div>
  )
}

export default PostStats;