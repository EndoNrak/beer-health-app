function generateRandomString(length: number) {
    const charset =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_~.";
    let random = "";
    const randomValues = Array.from(
        getCrypto().getRandomValues(new Uint8Array(length))
    );
    randomValues.forEach((v) => (random += charset[v % charset.length]));
    return random;
    }
export default generateRandomString

export const getCrypto = (): Crypto => {
    return window.crypto;
  };