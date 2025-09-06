"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadArray = exports.uploadFields = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
exports.upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
exports.uploadFields = exports.upload.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'profile', maxCount: 1 },
]);
exports.uploadArray = exports.upload.array('media');
