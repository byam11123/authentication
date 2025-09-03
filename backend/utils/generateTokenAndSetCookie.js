import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt-token", token, {
    httpOnly: true, //prevent from XSS Attack
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", //csrf
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
