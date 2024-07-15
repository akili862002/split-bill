import slugify from "slugify";

export const generateAvatar = (firstName: string, lastName?: string) => {
  const walls = [
    {
      background: "e2e8f0",
      color: "1e293b",
    },
    {
      background: "fecaca",
      color: "991b1b",
    },
    {
      background: "fed7aa",
      color: "c2410c",
    },
    {
      background: "d9f99d",
      color: "4d7c0f",
    },
    {
      background: "bbf7d0",
      color: "15803d",
    },
    {
      background: "6ee7b7",
      color: "047857",
    },
    {
      background: "bae6fd",
      color: "0369a1",
    },
    {
      background: "e9d5ff",
      color: "7e22ce",
    },
  ];
  const wall = walls[Math.floor(Math.random() * walls.length)];

  const url = `https://ui-avatars.com/api/?background=${
    wall.background
  }&color=${wall.color}&font-size=0.4&bold=true&name=${slugify(firstName)}${
    lastName ? "+" + slugify(lastName) : ""
  }`;

  return url;
};
