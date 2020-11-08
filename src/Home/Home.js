import React from "react";
import Card from "./Card.js";

const Home = () => {
  const items = [
    {
      id: "1",
      title: "title",
      content: "content",
      username: "username",
      votes: "22",
    },
    {
      id: "2",
      title: "title",
      content: "content",
      username: "username",
      votes: "22",
    },
  ];
  return (
    <div>
      {items.map((item) => (
        <Card
          key={item.id}
          id={item.id}
          title={item.title}
          content={item.content}
          username={item.username}
          votes={item.votes}
        />
      ))}
    </div>
  );
};

export default Home;
