// const fakeData = require("../data/fakeData.json");

// // Controller: Fetch ID details
// exports.fetchNationalIdDetails = (req, res) => {
//   const nationalId = req.params.id;

//   // Search the fake database
//   const user = fakeData.find((item) => item.id === nationalId);

//   if (!user) {
//     return res.status(404).json({
//       success: false,
//       message: "No user found with this National ID",
//     });
//   }

//   // Return the user data
//   res.json({
//     success: true,
//     data: user,
//   });
// };



const fakeData = require("../data/fakeData.json");

exports.fetchNationalIdDetails = (req, res) => {
  const { id } = req.params;

  if (!/^\d{16}$/.test(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format. Must be 16 digits.",
    });
  }

  const user = fakeData.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "National ID not found",
    });
  }

  return res.json({
    success: true,
    data: user,
  });
};
