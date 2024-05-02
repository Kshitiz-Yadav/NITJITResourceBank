const { query } = require("express");
const Users = require("./user"); // Assuming your User model is defined in userModel.js

async function getUsersWithNoPrivileges() {
  try {
    const users = await Users.find({ admin: false, faculty: false}).sort({username:1});
    return users;
  } catch (error) {
    console.error(error);
    throw error; 
  }
}

async function getUsersWithPrivileges() {
    try {
      const users = await Users.find({faculty: true });
      return users;
    } catch (error) {
      console.error(error);
      throw error; 
    }
  }

  async function removeUserById(userId) {
    try {
      await Users.deleteOne({ _id: userId });
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  async function updateUserModeById(userId, mode) {
    try {
      const result = await Users.updateOne({ _id: userId }, { $set: { faculty: mode } });
    } catch (error) {
      throw error;
    }
  }

module.exports = {getUsersWithNoPrivileges, getUsersWithPrivileges, removeUserById, updateUserModeById};
