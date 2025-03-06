import crypto from "node:crypto";

const hashToken = (Token) => {
    //hash token using sha256

    return crypto.createHash("sha256").update(Token.toString()).digest("hex");
}

export default hashToken;