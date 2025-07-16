import { Router } from "express";
import { UserController } from "../../controllers/user/userController";
import { jwtAuthMiddleware } from "../../middleware/auth";

const userRouter = Router();
const userController = new UserController();

userRouter.post("/user/register", (req, res) =>
  userController.register(req, res)
);
userRouter.post("/user/login", (req, res) => userController.login(req, res));
userRouter.post("/:id/aptitude-test", (req, res) =>
  userController.aptitudeTest(req, res)
);
userRouter.post("/:id/job-experience", (req, res) =>
  userController.jobExperience(req, res)
);
userRouter.post("/:id/trust-evaluation", (req, res) =>
  userController.trustEvaluation(req, res)
);
userRouter.get("/:id", (req, res) => userController.getMyPage(req, res));
userRouter.put("/:id/profile", (req, res) =>
  userController.updateProfile(req, res)
);
userRouter.put("/:id/password", (req, res) =>
  userController.changePassword(req, res)
);
userRouter.get("/user/exist", (req, res) => userController.existsId(req, res));
userRouter.get("/user/mypage", jwtAuthMiddleware, (req, res) =>
  userController.getUserMyPage(req, res)
);

export default userRouter;
