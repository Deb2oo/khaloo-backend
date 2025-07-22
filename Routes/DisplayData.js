const express = require("express");
const router = express.Router();

router.post("/foodData", async (req, res) => {
  try {
    res.send({
      food_items: global.food_items || [],
      food_category: global.food_category || [],
    });
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
