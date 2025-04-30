const bcrypt = require('bcrypt');
const Account = require('../models/Account');

module.exports.ProfilePage = (req, res) => {
  const { username } = req.session.account;
  res.render('profile', { username });
};

// handles updating the password!
module.exports.updatePassword = async (req, res) => {
  try {
    const { currentPass, newPass } = req.body;
    const account = await Account.findById(req.session.account._id);

    if (!account) return res.status(404).send('Account not found');

    Account.authenticate(account.username, currentPass, async (err, doc) => {
      if (err) return res.status(500).send('Error verifying current password');

      if (!doc) return res.status(400).send('Incorrect current password');

      const hashedPass = await bcrypt.hash(newPass, 10);
      account.password = hashedPass;
      await account.save();

      return res.send('Password updated!');
    });
  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).send('Error updating password');
  }
};
