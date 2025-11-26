const fakeData = require("../data/fakeData.json");

// Controller: Fetch ID details
exports.fetchNationalIdDetails = (req, res) => {
  const nationalId = req.params.id;

  // Search the fake database
  const user = fakeData.find((item) => item.id === nationalId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "No user found with this National ID",
    });
  }

  // Return the user data
  res.json({
    success: true,
    data: user,
  });
};
