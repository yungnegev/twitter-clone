import { type NextPage } from "next";
import Head from "next/head";
import { SignInButton, useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import Image from "next/image";
import LoadingSpinner from "~/componsents/LoadingSpinner";

dayjs.extend(relativeTime)

const CreatePostWizzard = () => {
  const { user } = useUser()
  console.log(user)
  if (!user) return null

  return (
    <div className="flex gap-6">
      <Image 
        src={user.profileImageUrl} 
        alt="profile image" 
        className="w-14 h-14 rounded-full"
        width={56}
        height={56}
        />
      <input type="text" placeholder="Type some emojis!" className="bg-transparent grow outline-none" />
    </div>
  )
}

type PostWithUser = RouterOutputs["posts"]["getAll"][number]

const PostView = (props: PostWithUser) => {
  const { post, author } = props
  return(
    <div key={post.id} className="border-b border-zinc-500 p-4 flex gap-4">
      <Image 
        src={author.profileImageUrl} 
        alt="profileimage" 
        className="w-14 h-14 rounded-full" 
        height={56}
        width={56}
        />
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className="text-sky-600">{`@${author.username}`}</span> 
          <span className="font-thin text-gray-400 text-sm">{`・ ${dayjs(post.createdAt).fromNow()}`}</span>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  )
}


const Home: NextPage = () => {

  const user = useUser()

  const { data, isLoading } = api.posts.getAll.useQuery()

  if (isLoading) return <LoadingPage />

  if (!data) return <div>Something went wrong!</div>

  return (
    <>
      <Head>
        <title>Chirp</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen flex-col items-center">
        <div className="h-full w-full border-x border-zinc-500 md:max-w-2xl  ">
          <div className="border-b border-zinc-500 p-4">
            {!user.isSignedIn && (
              <div className="flex justify-center">
                <SignInButton>Sign in</SignInButton>
              </div>
            )}
            {!!user.isSignedIn && <CreatePostWizzard />}
          </div>
          <div className="flex flex-col">
            {data?.map((fullPost) => {
              return (
                <PostView {...fullPost} key={fullPost.post.id}/>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;



export const LoadingPage = () => {
  return(
    <div className="absolute top-0 right-0 flex justify-center items-center h-screen w-screen">
      <LoadingSpinner />
    </div>
  )
}