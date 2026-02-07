"use client";

import React from "react";
import PodcastCard from "@/components/PodcastCard";
import { podcastData } from "@/constants";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const Home = () => {
  const tasks = useQuery(api.task.get);

  return (
    <div className="mt-9 flex flex-col gap-9">
      {/* Convex test data */}
      <div className="text-white-1">
        {tasks?.map(({ _id, text }) => (
          <div key={_id}>{text}</div>
        ))}
      </div>

      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Trending Podcasts</h1>
        <div className="podcast_grid">
          {podcastData.map(({ id, title, description, imgURL }) => (
            <PodcastCard
              key={id}
              imgURL={imgURL}
              title={title}
              description={description}
              podcastId={id}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
