const crypto = require("crypto");
const { Schema, default: mongoose } = require("mongoose");

const userSchema = new Schema({
    name: { type: String, required: true, trim: true },
    surname: { type: String, required: true, trim: true },
    age: { type: Number, min: 12, max: 130 },
    email: { type: String, lowercase: true, trim: true, required: true },
    registeredAt: { type: Date, default: Date.now(), imutable: true },
    password: { type: String, required: true , trim: true},
    username: { type: String, required: true, trim: true },
    role: { type: String, default: "Anonymous"}
});

userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.password = crypto
        .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
        .toString("hex");
};
  
userSchema.methods.checkPassword = function (password) {
    const hash_pwd = crypto
        .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
    return this.password === hash_pwd;
};

module.exports = mongoose.model("User", userSchema);