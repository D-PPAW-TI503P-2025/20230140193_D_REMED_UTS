const authMiddleware = (role) => {
    return (req, res, next) => {
        const userRole = req.headers['x-user-role'];
        const userId = req.headers['x-user-id'];

        if (!userRole) {
            return res.status(401).json({ message: 'No role provided in headers (x-user-role)' });
        }

        if (role === 'admin' && userRole !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin role required.' });
        }

        if (role === 'user') {
            if (userRole !== 'user' && userRole !== 'admin') {
                return res.status(403).json({ message: 'Access denied. User role required.' });
            }
            if (!userId) {
                return res.status(401).json({ message: 'No user ID provided in headers (x-user-id)' });
            }
        }

        next();
    };
};

module.exports = authMiddleware;
