module.exports = function role(...allowed) {
    return (req, res, next) => {
        if (!req.user?.role) return res.status(401).json({ error: "unauthorized" });
        if (!allowed.includes(req.user.role)) return res.status(403).json({ error: "forbidden" });
        next();
    };
};
