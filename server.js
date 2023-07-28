const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/test1", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

//Schema User;
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
  },
  {
    collection: "user",
  }
);
//Model User;
const User = mongoose.model("User", userSchema);

// Endpoint GET: Lấy danh sách người dùng;
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Lỗi lấy danh sách người dùng" });
  }
});

// Endpoint POST: Tạo mới người dùng;
app.post("/users/user", async (req, res) => {
  const { username, password, email, fullname, avatar } = req.body;
  try {
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      // Username đã tồn tại;
      res.json({ exists: true });
    } else {
      const newUser = new User({
        username,
        password,
        email,
        fullname,
        avatar,
      });
      const savedUser = await newUser.save();
      res.json({ exists: false, savedUser }); // false là chưa có username thì đăng ký;
    }
  } catch (error) {
    res.status(500).json({ error: "Lỗi tạo mới người dùng" });
  }
});


// Endpoint PUT: Cập nhật thông tin người dùng;
app.put("/users/:id", async (req, res) => {
    const userId = req.params.id;
    const { username, password, email, fullname, avatar } = req.body;
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { username, password, email, fullname, avatar},
        { new: true }
      );
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: "Không tìm thấy người dùng" });
      }
    } catch (error) {
      res.status(500).json({ error: "Lỗi cập nhật người dùng" });
    }
  });
  

  // Endpoint DELETE: Xóa người dùng;
app.delete("/users/:id", async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await User.findByIdAndDelete(userId);
      if (user) {
        res.json({ message: "Xóa người dùng thành công" });
      } else {
        res.status(404).json({ error: "Không tìm thấy người dùng" });
      }
    } catch (error) {
      res.status(500).json({ error: "Lỗi xóa người dùng" });
    }
  });
  

  const port = 3000;


  
app.listen(port, () => console.log(`Server đang chạy trên port ${port}`));
