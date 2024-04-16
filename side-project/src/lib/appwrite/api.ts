import { ID, Query } from "appwrite";
import { INewUser } from "@/types";
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