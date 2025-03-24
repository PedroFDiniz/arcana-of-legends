import express from "express";
import {
    validateCreation,
    validateUpdate,
} from "../middleware/user.validation";
import {
    create,
    destroy,
    destroyMany,
    read,
    readAll,
    update,
} from "../controller/user.controller";
import {
    isSelfOrAdmin,
    hasAdminRights,
} from "../middleware/auth";

const router = express.Router();

router.post     (`/user/`, validateCreation, create);
router.get      (`/user/:id`, isSelfOrAdmin, read);
router.patch    (`/user/:id`, isSelfOrAdmin, validateUpdate, update);
router.delete   (`/user/:id`, isSelfOrAdmin, destroy);
router.get      (`/users`, hasAdminRights, readAll);
router.post     (`/users/delete`, hasAdminRights, destroyMany);

export default router;