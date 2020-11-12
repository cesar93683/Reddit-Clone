import React from "react";
import Card from "./Card.js";
import "./Home.css";

const Home = () => {
  const items = [
    {
      id: "1",
      title:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
      username: "username",
      votes: "1",
      numComments: "100",
    },
    {
      id: "2",
      title:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore",
      username: "username",
      votes: "11100",
      numComments: "1",
    },
  ];
  return (
    <div className="Home center">
      {items.map((item) => (
        <Card
          key={item.id}
          id={item.id}
          title={item.title}
          username={item.username}
          votes={item.votes}
          numComments={item.numComments}
        />
      ))}
    </div>
  );
};

export default Home;
