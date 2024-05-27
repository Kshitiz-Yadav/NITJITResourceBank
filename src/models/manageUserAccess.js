const { query } = require("express");
const Users = require("./user"); // Assuming your User model is defined in userModel.js

async function getUsersWithNoPrivileges() {
  const users = await Users.find({ admin: false, faculty: false}).sort({username:1});
    return users;
}

async function getUsersWithPrivileges() {
  const users = await Users.find({faculty: true });
  return users;
  }

  async function removeUserById(userId) {
    await Users.deleteOne({ _id: userId });
  }

  async function updateUserModeById(userId, mode) {
    const result = await Users.updateOne({ _id: userId }, { $set: { faculty: mode } });
  }

module.exports = {getUsersWithNoPrivileges, getUsersWithPrivileges, removeUserById, updateUserModeById};
