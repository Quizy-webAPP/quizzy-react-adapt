// controllers/groupController.js

exports.getGroup = async (req, res) => {
  try {
    const group = await firestore.collection('groups').doc(req.params.id).get();
    if (!group.exists) {
      return res.status(404).json({ msg: 'Group not found' });
    }
    res.json(group.data());
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.joinGroup = async (req, res) => {
  const { userId } = req.body;
  try {
    const groupRef = firestore.collection('groups').doc(req.params.id);
    await groupRef.update({
      members: admin.firestore.FieldValue.arrayUnion(userId)
    });
    res.json({ msg: 'Joined group successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
