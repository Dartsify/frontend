export const userIsGuest = (username: string) => {
  return username.includes("guest_");
};
