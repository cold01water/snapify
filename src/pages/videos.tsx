import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";

const VideoList: NextPage = () => {
  const router = useRouter();
  const { status } = useSession();
  const { data: videos } = api.video.getAll.useQuery();
  const getUploadUrl = api.video.getUploadUrl.useMutation();

  if (status === "unauthenticated") {
    void router.push("/sign-in");
  }

  const onUpload = () => {
    const data = getUploadUrl.mutate({ key: "something random" });
    console.log(data);
  };

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="flex min-h-[80px] w-full items-center justify-between border-b border-solid border-b-[#E7E9EB] bg-white px-6">
          <span>Screenity</span>
          <div>
            <span
              onClick={onUpload}
              className="cursor-pointer rounded border border-[#0000001a] px-2 py-2 text-sm text-[#292d34] hover:bg-[#fafbfc]"
            >
              New video
            </span>
          </div>
        </div>
        <div className="flex w-full grow items-start justify-center overflow-auto bg-[#fbfbfb] pt-14">
          <div className="flex-start jusitfy-start container flex max-w-[1200px] flex-row flex-wrap items-center gap-14 px-4 pb-16">
            {[
              {
                title: "Are pings bad?",
                id: "4e98f4a",
                timestamp: 1681211128621,
              },
              {
                title:
                  "do you really need a backend? because there is a much better alternative to it.",
                id: "h4b98rt",
                timestamp: 1681011128621,
              },
              {
                title: "how next works",
                id: "1h7r9e",
                timestamp: 1681211120621,
              },
              {
                title: "how next works",
                id: "h27r9e",
                timestamp: 1681210128621,
              },
              {
                title: "how next works",
                id: "h73r9e",
                timestamp: 1681211118621,
              },
              {
                title: "how next works",
                id: "h7r49e",
                timestamp: 1695211128621,
              },
            ].map(({ title, id, timestamp }) => (
              <VideoCard title={title} id={id} timestamp={timestamp} key={id} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

interface VideoCardProps {
  title: string;
  id: string;
  timestamp: number;
}

const VideoCard = ({ title, id, timestamp }: VideoCardProps) => {
  const getTime = (timestamp: number): string => {
    const delta = Math.round(
      (+new Date() - new Date(timestamp).getTime()) / 1000
    );

    const minute = 60,
      hour = minute * 60,
      day = hour * 24;

    let timeString = "";

    if (delta < 60) {
      timeString = "Just now";
    } else if (delta < 2 * minute) {
      timeString = "1 min";
    } else if (delta < hour) {
      timeString = Math.floor(delta / minute).toString() + " mins";
    } else if (Math.floor(delta / hour) === 1) {
      timeString = "1 hour ago";
    } else if (delta < day) {
      timeString = Math.floor(delta / hour).toString() + " hours ago";
    } else if (delta < day * 2) {
      timeString = "yesterday";
    } else if (delta < day * 7) {
      timeString = Math.floor(delta / day).toString() + " days ago";
    } else {
      const date = new Date(timestamp);
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      timeString =
        `${
          months[date.getMonth()] || ""
        }} ${date.getDate()} ${date.getFullYear()} ` +
        `at ${
          date.getHours().toString().length === 1
            ? "0" + date.getHours().toString()
            : date.getHours()
        }:${
          date.getMinutes().toString().length === 1
            ? "0" + date.getMinutes().toString()
            : date.getMinutes()
        }`;
    }

    return timeString;
  };

  return (
    <Link href={`/share/${id}`}>
      <div className="h-[240px] w-[250px] cursor-pointer overflow-hidden rounded-lg border border-[#6c668533] text-sm font-normal">
        <figure className="relative">
          <Image
            src="https://f003.backblazeb2.com/file/test-bucket-dev/green+vs+blue+bbbles.jpg"
            alt="video thumbnail"
            fill={true}
            className="!relative object-contain"
          />
        </figure>
        <div className="m-4 flex flex-col">
          <span className="line-clamp-2 font-bold text-[0f0f0f]">{title}</span>
          <span className="text-[#606060]">{getTime(timestamp)}</span>
        </div>
      </div>
    </Link>
  );
};

export default VideoList;
