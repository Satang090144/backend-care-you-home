const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, CustomerProfile, ProviderProfile } = require("../models");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    }

    let profile = null;

    if (user.role === "customer") {
      profile = await CustomerProfile.findOne({ where: { user_id: user.id } });
    } else if (user.role === "provider") {
      profile = await ProviderProfile.findOne({ where: { user_id: user.id } });
    }

    res.json({ user, profile });

  } catch (err) {
    console.error("❌ GetMe Error:", err);
    res.status(500).json({ error: err.message });
  }
};