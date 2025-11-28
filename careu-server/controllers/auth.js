const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, CustomerProfile, ProviderProfile } = require("../models");

exports.register = async (req, res) => {
  try {
    // ✅ ดึงค่าจาก frontend (ReqServiceForm)
    const {
      fullName,
      nickname,
      age,
      occupation,
      gender,
      idNumber,
      email,
      phone,
      lineId,
      maritalStatus,
      hasChildren,
      numberOfChildren,
      chronicDiseases,
      pastIllness,
      pastTreatment,
      tumorHistory,
      labResults,
      imagingResults,
      supplements,
      brainSurgery,
      hospitalized,
      caregiverType,
      location,
    } = req.body;

    // ✅ ตรวจสอบว่า user ซ้ำไหม (ตามเลขบัตรประชาชน)
    const existing = await CustomerProfile.findOne({ where: { id_card: idNumber } });
    if (existing)
      return res.status(400).json({ message: "เลขประจำตัวประชาชนนี้ถูกใช้งานแล้ว" });

    // ✅ เข้ารหัสรหัสผ่าน (ใช้เบอร์โทร)
    const hashed = await bcrypt.hash(phone, 10);

    // ✅ สร้าง User
    const user = await User.create({
      name: fullName,
      email,
      password: hashed,
      phone,
      role: "customer",
    });

    // ✅ สร้าง CustomerProfile
    const profile = await CustomerProfile.create({
      user_id: user.id,
      full_name: fullName,
      nickname,
      age,
      gender,
      occupation,
      id_card: idNumber,
      email,
      phone,
      line_id: lineId,
      marital_status: maritalStatus?.[0] || maritalStatus || null, // ถ้ามีหลายค่าเลือกอันแรก
      has_children: hasChildren === "มี",
      num_children: numberOfChildren || 0,
      underlying_disease: chronicDiseases,
      past_illness: pastIllness,
      past_treatment: pastTreatment,
      cancer_history: tumorHistory,
      lab_result: labResults,
      imaging_result: imagingResults,
      supplement: supplements,
      brain_surgery: brainSurgery,
      in_hospital: hospitalized,
      need_service: caregiverType === "นักกายภาพบำบัด" ? "นักกายภาพ" : "ผู้ดูแลผู้ป่วย",
      location,
    });

    return res.status(201).json({
      message: "สมัครสมาชิกสำเร็จ",
      user,
      profile,
    });
  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({ error: err.message });
  }
};
exports.login = async (req, res) => {
  try {
    const { idNumber, password } = req.body; // ✅ ใช้ idNumber แทน email

    const profile = await CustomerProfile.findOne({
      where: { id_card: idNumber },
      include: [{ model: User }],
    });

    if (!profile) return res.status(404).json({ message: "ไม่พบบัญชีผู้ใช้" });

    const user = profile.User;

    // ✅ ตรวจรหัสผ่าน
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "careu_secret",
      { expiresIn: "7d" }
    );

    res.json({
      message: "เข้าสู่ระบบสำเร็จ",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      profile: {
        id_card: profile.id_card,
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ error: err.message });
  }
};




exports.registerProvider = async (req, res) => {
  try {
    const {
      nickname,
      fullName,
      idNumber,
      phone,
      email,
      age,
      gender,
      position,
      applicationType,
      partTimeDetails,
      preferredBranch,
      availableDate,
      experience,
      workHistory,
      tools,
      resumeLink,
      licenseLink,
    } = req.body;

    // ✅ ตรวจสอบว่า user ซ้ำไหม (อีเมลซ้ำ)
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail)
      return res.status(400).json({ message: "อีเมลนี้ถูกใช้งานแล้ว" });

    // ✅ ตรวจสอบเลขบัตรประชาชนซ้ำไหม (provider)
    const existingId = await ProviderProfile.findOne({ where: { id_card: idNumber } });
    if (existingId)
      return res.status(400).json({ message: "เลขบัตรประชาชนนี้ถูกใช้งานแล้ว" });

    // ✅ เข้ารหัสรหัสผ่าน (เบอร์โทร)
    const hashed = await bcrypt.hash(phone, 10);

    // ✅ สร้าง user ใหม่ในตาราง users
    const user = await User.create({
      name: fullName,
      email, // ✅ เก็บอีเมลจริง
      password: hashed,
      phone,
      role: "provider",
    });

    // ✅ บันทึกข้อมูลใน provider_profiles
    const profile = await ProviderProfile.create({
      user_id: user.id,
      nickname,
      full_name: fullName,
      id_card: idNumber,
      phone,
      email,
      age,
      gender,
      position,
      work_type: applicationType === "Part Time" ? "PART TIME" : "FULL TIME",
      work_detail: partTimeDetails || null,
      preferred_area: preferredBranch,
      available_date: availableDate,
      experience,
      work_history: workHistory,
      tools,
      resume_link: resumeLink,
      license_link: licenseLink,
    });

    return res.status(201).json({
      message: "สมัครนักกายภาพสำเร็จ",
      user,
      profile,
    });
  } catch (err) {
    console.error("❌ Register Provider Error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.loginProvider = async (req, res) => {
  try {
    const { idNumber, password } = req.body; 

    
    const profile = await ProviderProfile.findOne({
      where: { id_card: idNumber },
      include: [{ model: User }],
    });

    if (!profile) {
      return res.status(404).json({ message: "ไม่พบบัญชีผู้ให้บริการ" });
    }

    const user = profile.User;

    
    if (!user.enabled) {
      return res.status(403).json({ message: "บัญชีนี้ถูกระงับการใช้งาน" });
    }

    
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" });
    }

   
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "careu_secret",
      { expiresIn: "7d" }
    );

    
    res.json({
      message: "เข้าสู่ระบบสำเร็จ",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      profile: {
        id_card: profile.id_card,
        status: profile.status,
      },
    });
  } catch (err) {
    console.error("❌ Login Provider Error:", err);
    res.status(500).json({ error: err.message });
  }
};

