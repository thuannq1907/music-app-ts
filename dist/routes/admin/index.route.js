"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_route_1 = require("./dashboard.route");
const topic_route_1 = require("./topic.route");
const song_route_1 = require("./song.route");
const system_1 = require("../../config/system");
const upload_route_1 = require("./upload.route");
const adminRoutes = (app) => {
    const prefixAdmin = system_1.systemConfig.prefixAdmin;
    app.use(`/${prefixAdmin}/dashboard`, dashboard_route_1.dashboardRoutes);
    app.use(`/${prefixAdmin}/topics`, topic_route_1.topicRoutes);
    app.use(`/${prefixAdmin}/songs`, song_route_1.songRoutes);
    app.use(`/${prefixAdmin}/upload`, upload_route_1.uploadRoutes);
};
exports.default = adminRoutes;
