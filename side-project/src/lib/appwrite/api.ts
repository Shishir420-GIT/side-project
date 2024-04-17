import { ID, Query } from "appwrite";
import { INewPost, INewUser } from "@/types";
import { appwriteConfig, account, databases, storage, avatars } from "./config";

export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        );
        if(!newAccount) throw Error;

        const avatarurl = avatars.getInitials(user.name);
        
        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarurl,
        });
        //console.log(newUser.name)
        //console.log("newUser is: ")
        //console.log(newUser)
        return newUser;
    }
    catch (error){
        console.log(error);
        return error;
    }
}

export async function saveUserToDB(user: {
    accountId: string;
    email: string;
    name: string;
    imageUrl: URL;
    username?: string;
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
        );
        //console.log("saved to db is: ")
        //console.log(newUser)
        return newUser
    }
    catch(error){
        console.log(error)
        return null;
    }
}

export async function signInAccount(user: { email: string; password: string }) {
    try {
      //console.log("Creating email sesssion")
      const session = await account.createEmailSession(user.email, user.password);
      //console.log("Created email sesssion")
      return session;
    } catch (error) {
        //console.log("Error in sesssion")
        console.log(error);
    }
  }

export async function getAccount() {
    try {
      //console.log("Getting account")
      const currentAccount = await account.get();
      //console.log("got account")
      //console.log(currentAccount)
      return currentAccount;
    } catch (error) {
      console.log(error);
    }
  }

export async function getCurrentUser(){
    try{
        //console.log("Getting current user")
        const currentAccount = await getAccount();

        if(!currentAccount) throw Error;
        //console.log("listing current user")
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        );
        //console.log("got current user")
        //console.log(currentUser)
        if(!currentUser) throw Error;

        return currentUser.documents[0];
    }
    catch(error){
        console.log(error)
        return null;
    }
}

export async function signOutAccount() {
    try{
        const session = await account.deleteSession("current")
        return session
    }
    catch(error){
        console.log(error)
    }
    
}

// ============================== UPLOAD FILE
export async function uploadFile(file: File) {
    try {
      const uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        file
      );
  
      return uploadedFile;
    } catch (error) {
      console.log(error);
    }
}
  
// ============================== GET FILE URL
export function getFilePreview(fileId: string) {
    try {
        const fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
        );

        if (!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        console.log(error);
    }
}

// ============================== DELETE FILE
export async function deleteFile(fileId: string) {
    try {
      await storage.deleteFile(appwriteConfig.storageId, fileId);
  
      return { status: "ok" };
    } catch (error) {
      console.log(error);
    }
}

export async function createPost(post: INewPost) {
    try {
      // Upload file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
  
      if (!uploadedFile) throw Error;
  
      // Get file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
  
      // Convert tags into array
      const tags = post.tags?.replace(/ /g, "").split(",") || [];
  
      // Create post
      const newPost = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        ID.unique(),
        {
          creator: post.userId,
          caption: post.caption,
          imageUrl: fileUrl,
          imageId: uploadedFile.$id,
          location: post.location,
          tags: tags,
        }
      );
  
      if (!newPost) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
  
      return newPost;
    } catch (error) {
      console.log(error);
    }
  }

export async function getRecentPosts(){
  const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc('$createdAt'), Query.limit(20)]
  );

  if(!posts) throw Error;

  return posts;
}


export async function likedPost(postId: string, likesArray: string[]){
  try{
    const updatePost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray
      }
    )
    if(!updatePost) throw Error;

    return updatePost;
  }
  catch(error){
    console.log(error)
  }
}

export async function savedPost(postId: string, userId: string){
  try{
    const updatePost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    )
    if(!updatePost) throw Error;

    return updatePost;
  }
  catch(error){
    console.log(error)
  }
}

export async function deleteSavedPost(savedRecordId: string){
  try{
    const updatePost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId,
    )
    if(!updatePost) throw Error;

    return {status: 'ok'};
  }
  catch(error){
    console.log(error)
  }
}