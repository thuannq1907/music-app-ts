"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listen = exports.favorite = exports.like = exports.detail = exports.list = void 0;
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const song_model_1 = __importDefault(require("../../models/song.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const favorite_song_model_1 = __importDefault(require("../../models/favorite-song.model"));
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slugTopic = req.params.slugTopic;
    const topic = yield topic_model_1.default.findOne({
        slug: slugTopic,
        deleted: false,
        status: "active"
    });
    const songs = yield song_model_1.default.find({
        topicId: topic.id,
        deleted: false,
        status: "active"
    }).select("avatar title singerId like slug");
    for (const song of songs) {
        const infoSinger = yield singer_model_1.default.findOne({
            _id: song.singerId,
            deleted: false
        });
        song["infoSinger"] = infoSinger;
    }
    res.render("client/pages/songs/list", {
        pageTitle: topic.title,
        songs: songs
    });
});
exports.list = list;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slugSong = req.params.slugSong;
    const song = yield song_model_1.default.findOne({
        slug: slugSong,
        deleted: false,
        status: "active"
    });
    const singer = yield singer_model_1.default.findOne({
        _id: song.singerId,
        deleted: false
    }).select("fullName");
    const topic = yield topic_model_1.default.findOne({
        _id: song.topicId,
        deleted: false
    });
    const favoriteSong = yield favorite_song_model_1.default.findOne({
        userId: "",
        songId: song.id
    });
    song["isFavoriteSong"] = favoriteSong ? true : false;
    res.render("client/pages/songs/detail", {
        pageTitle: "Chi tiết bài hát",
        song: song,
        singer: singer,
        topic: topic
    });
});
exports.detail = detail;
const like = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idSong = req.params.idSong;
    const type = req.params.type;
    const song = yield song_model_1.default.findOne({
        _id: idSong,
        deleted: false,
        status: "active"
    });
    let updateLike = song.like;
    if (type == "yes") {
        updateLike += 1;
    }
    else {
        updateLike -= 1;
    }
    yield song_model_1.default.updateOne({
        _id: idSong
    }, {
        like: updateLike
    });
    res.json({
        code: 200,
        message: "Thành công!",
        like: updateLike
    });
});
exports.like = like;
const favorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idSong = req.params.idSong;
    const type = req.params.type;
    if (type == "yes") {
        const existRecord = yield favorite_song_model_1.default.findOne({
            userId: "",
            songId: idSong,
        });
        if (!existRecord) {
            const record = new favorite_song_model_1.default({
                userId: "",
                songId: idSong,
            });
            yield record.save();
        }
    }
    else {
        yield favorite_song_model_1.default.deleteOne({
            userId: "",
            songId: idSong
        });
    }
    res.json({
        code: 200,
        message: "Thành công!"
    });
});
exports.favorite = favorite;
const listen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idSong = req.params.idSong;
    const song = yield song_model_1.default.findOne({
        _id: idSong
    });
    const listen = song.listen + 1;
    yield song_model_1.default.updateOne({
        _id: idSong
    }, {
        listen: listen
    });
    res.json({
        code: 200,
        message: "Thành công!",
        listen: listen
    });
});
exports.listen = listen;
