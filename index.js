// express server on port 3000 and serve static files from public folder
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.static(__dirname + "/public"));
app.listen(port);
console.log("Server started: http://localhost:" + port + "/");

// A router to generate qr codes
const router = express.Router();
router.get("/qr", function (req, res) {
  const qr = require("qr-image");
  const qr_svg = qr.image(req.query.text, { type: "png" });
  res.type("png");
  qr_svg.pipe(res);
});

// A router to recognize faces
router.post("/face", function (req, res) {
  const fs = require("fs");
  const face = require("face-recognition");
  const image = fs.readFileSync(req.body.image);
  const faces = face.findFaces(image);
  res.json(faces);
});

// A router to recognize text
router.post("/text", function (req, res) {
  const tesseract = require("node-tesseract");
  tesseract.process(req.body.image, function (err, text) {
    if (err) {
      console.error(err);
    }
    res.json(text);
  });
});

// manual router
router.get("/test", (req, res) => {
  const date1 = new Date(req.query.date1);
  const date2 = new Date(req.query.date2);
  const timeDiff = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  res.json(diffDays);
});

app.use("/", router);
