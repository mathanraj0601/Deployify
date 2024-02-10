const STRING_LENGTH = 10;

export function generateRandom() {
  let ans = "";
  const characters = "1234567890qwertyuiopasdfghjklzxcvbnm";
  for (let i = 0; i < STRING_LENGTH; i++) {
    ans += characters[Math.floor(Math.random() * characters.length)];
  }
  return ans;
}
