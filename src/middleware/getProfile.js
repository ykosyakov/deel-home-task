const logger = require('../utils/logger');

const getProfile = async (req, res, next) => {
    const { Profile } = req.app.get('models');
    const profile = await Profile.findOne({ where: { id: req.get('profile_id') || 0 } });
    if (!profile) {
        logger.warn(`Profile with id ${req.get('profile_id')} not found`);
        return res.status(401).end();
    }
    req.profile = profile;
    return next();
};
module.exports = { getProfile };