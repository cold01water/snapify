import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import { getTime } from "~/utils/getTime";
import ProfileMenu from "~/components/ProfileMenu";
import NewVideoMenu from "~/components/NewVideoMenu";
import VideoRecordModal from "~/components/VideoRecordModal";
import VideoUploadModal from "~/components/VideoUploadModal";
import { useAtom } from "jotai";
import uploadVideoModalOpen from "~/atoms/uploadVideoModalOpen";
import recordVideoModalOpen from "~/atoms/recordVideoModalOpen";
import Paywall from "~/components/Paywall";
import paywallAtom from "~/atoms/paywallAtom";

const VideoList: NextPage = () => {
  const [, setRecordOpen] = useAtom(uploadVideoModalOpen);
  const [, setUploadOpen] = useAtom(recordVideoModalOpen);
  const [, setPaywallOpen] = useAtom(paywallAtom);
  const router = useRouter();
  const { status, data: session } = useSession();
  const { data: videos, isLoading } = api.video.getAll.useQuery();

  if (status === "unauthenticated") {
    void router.replace("/sign-in");
  }

  return (
    <>
      <Head>
        <title>Library | Snapify</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="flex min-h-[62px] w-full items-center justify-between border-b border-solid border-b-[#E7E9EB] bg-white px-6">
          <span>Snapify</span>
          <div className="flex flex-row items-center justify-center">
            <VideoRecordModal />
            <VideoUploadModal />
            <Paywall />

            <NewVideoMenu />
            {status === "authenticated" && (
              <div className="ml-4 flex items-center justify-center">
                <ProfileMenu />
              </div>
            )}
          </div>
        </div>
        <div className="flex w-full grow items-start justify-center overflow-auto bg-[#fbfbfb] pt-14">
          {videos && videos?.length <= 0 ? (
            <div className="flex items-center justify-center">
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-zinc-700">
                  No videos found
                </span>
                <span className="mt-1 text-base text-zinc-500">
                  Videos you record will show up here. Already got videos?
                  Upload them!
                </span>
                <div className="mt-4">
                  <button
                    onClick={() => setUploadOpen(true)}
                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Record a video
                  </button>
                  <button
                    onClick={() => setRecordOpen(true)}
                    className="ml-4 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Upload a video
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-start grid w-full max-w-[1300px] grid-cols-[repeat(auto-fill,250px)] flex-row flex-wrap items-center justify-center gap-14 px-4 pb-16">
              {videos &&
                videos.map(({ title, id, createdAt }) => (
                  <VideoCard
                    title={title}
                    id={id}
                    createdAt={createdAt}
                    key={id}
                  />
                ))}

              {isLoading ? (
                <>
                  <VideoCardSkeleton />
                  <VideoCardSkeleton />
                  <VideoCardSkeleton />
                  <VideoCardSkeleton />
                </>
              ) : null}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

interface VideoCardProps {
  title: string;
  id: string;
  createdAt: Date;
}

const VideoCardSkeleton = () => {
  return (
    <div className="h-[240px] w-[250px] animate-pulse overflow-hidden rounded-lg border border-[#6c668533] text-sm font-normal">
      <figure className="relative aspect-video w-full bg-slate-200"></figure>
      <div className="m-4 flex flex-col">
        <span className="h-4 rounded bg-slate-200"></span>
        <span className="mt-4 h-4 rounded bg-slate-200"></span>
      </div>
    </div>
  );
};

const VideoCard = ({ title, id, createdAt }: VideoCardProps) => {
  return (
    <Link href={`/share/${id}`}>
      <div className="h-[240px] w-[250px] cursor-pointer overflow-hidden rounded-lg border border-[#6c668533] text-sm font-normal">
        <figure>
          <Image
            src="https://i3.ytimg.com/vi/BuaKzm7Kq9Q/maxresdefault.jpg"
            alt="video thumbnail"
            width={248}
            height={139.5}
          />
        </figure>
        <div className="m-4 flex flex-col">
          <span className="line-clamp-2 font-bold text-[0f0f0f]">{title}</span>
          <span className="mt-2 text-[#606060]">{getTime(createdAt)}</span>
        </div>
      </div>
    </Link>
  );
};

export default VideoList;
