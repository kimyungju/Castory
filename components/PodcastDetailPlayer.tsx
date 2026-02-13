"use client";

import Image from "next/image";
import { normalizeImageSrc } from "@/lib/utils";
import React from "react";

const PodcastDetailPlayer = ({
  audioUrl,
  podcastTitle,
  author,
  imageUrl,
  authorImageUrl,
  isOwner,
}: {
  audioUrl: string;
  podcastTitle: string;
  author: string;
  imageUrl: string;
  authorImageUrl: string;
  isOwner: boolean;
}) => {
  const [imgSrc, setImgSrc] = React.useState(() => normalizeImageSrc(imageUrl));
  const [authorSrc, setAuthorSrc] = React.useState(() =>
    normalizeImageSrc(authorImageUrl)
  );

  return (
    <div className="flex flex-col gap-8 max-w-[720px]">
      <div className="flex items-center gap-6">
        <div className="card-brutal overflow-hidden w-[250px] h-[250px] flex-shrink-0">
          <Image
            src={imgSrc}
            width={250}
            height={250}
            alt={podcastTitle}
            className="w-full h-full object-cover"
            onError={() => setImgSrc("/placeholder.svg")}
          />
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-32 font-extrabold text-white-1 uppercase tracking-wide">
            {podcastTitle}
          </h1>

          <div className="flex items-center gap-2">
            <Image
              src={authorSrc}
              width={30}
              height={30}
              alt={author}
              className="rounded-none border-2 border-orange-1"
              onError={() => setAuthorSrc("/placeholder.svg")}
            />
            <span className="text-14 font-bold text-white-3">{author}</span>
            {isOwner && (
              <span className="text-10 bg-orange-1 text-charcoal px-2 py-0.5 font-black uppercase">
                Owner
              </span>
            )}
          </div>
        </div>
      </div>

      {audioUrl && (
        <audio controls className="w-full" src={audioUrl}>
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default PodcastDetailPlayer;
