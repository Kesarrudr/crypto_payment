interface mintDetail {
  mintAddress: string;
  mintName: string;
}

const mintDetails: mintDetail[] = [
  {
    mintName: "USDT",
    mintAddress: "EmXq3Ni9gfudTiyNKzzYvpnQqnJEMRw2ttnVXoJXjLo1",
  },
  {
    mintName: "USDC",
    mintAddress: "EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS",
  },
];

export { type mintDetail, mintDetails };
