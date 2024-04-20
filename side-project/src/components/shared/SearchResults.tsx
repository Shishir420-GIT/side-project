import { Loader } from './Loader'
import GridPostList from './GridPostList'

type SearchResultsProp = {
    isSearchFetching: boolean,
    searchedPosts: any
}

const SearchResults = ( {isSearchFetching, searchedPosts }: SearchResultsProp) => {
  
    if(isSearchFetching) return <Loader/>

    if(searchedPosts && searchedPosts.documents.length > 0){
        return(
            <GridPostList posts={searchedPosts.documents}/>
        )
    }
    return (
    <p className='text-light-4 mt-10 text-cneter w-full'>
        No posts found.
    </p>
  )
}

export default SearchResults